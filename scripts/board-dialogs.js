const dialogModes = {
  addTaskMode: "add-task",
  editTaskMode: "edit-task",
}
const taskCategoryButtons = [
  {
    taskCategory: "toDo",
    button: document.getElementById("btn-to-do"),
  },
  {
    taskCategory: "inProgress",
    button: document.getElementById("btn-in-progress"),
  },
  {
    taskCategory: "awaitFeedback",
    button: document.getElementById("btn-await-feedback"),
  },
];

function setTaskFormUsers(select, users = []) {
  Array.from(select.options).forEach((option) => {
    option.selected = users.includes(option.value);
  });
}

document.addEventListener("click", handleTaskCardClick);
document.addEventListener("keydown", handleTaskCardKeydown);
document.addEventListener("change", handleSubtaskCheckboxChange);

document.addEventListener("submit", (event) => {
  const form = event.target;

  if (form.classList.contains(dialogModes.addTaskMode)) {
    event.preventDefault();
    submitTask(event);
    return;
  }

  if (form.classList.contains(dialogModes.editTaskMode)) {
    event.preventDefault();
    submitEditedTask();
    return;
  }
});

/**
 * Keeps Enter in the subtask inputs from submitting the whole form.
 * @param {KeyboardEvent} event - Document keydown event.
 * @returns {void}
 */
document.addEventListener("keydown", (event) => {
  if (event.target.name === "subtask") addSubtaskOnEnter(event);
  if (event.target.name === "subtask-edit") saveSubtaskOnEnter(event);
});

document.getElementById("btn-add-task").addEventListener("click", () => {
  openAddTaskDialog("toDo");
});

addClickEventListenersToTaskCategoryButtons();

function addClickEventListenersToTaskCategoryButtons() {
  taskCategoryButtons.forEach((item) => {
    item.button.addEventListener("click", () => {
      openAddTaskDialog(item.taskCategory);
    });
  });
}

function getTaskForm() {
  return document.querySelector("#add-task-form");
}

async function openAddTaskDialog(status) {
  const addTaskDialog = document.getElementById("add-task-dialog");
  editingTaskId = "";
  newTaskCategory = status;
  selectedTaskPriority = "medium";
  newTaskSubtasks = [];
  addTaskDialog.innerHTML = getAddTaskDialogContentTemplate();
  const taskForm = getTaskForm();
  getTaskForm().classList.add(dialogModes.addTaskMode);
  await renderAssignedContacts(taskForm);
  initPriorityButtonClickListeners();
  clickEventListener(addTaskDialog);
  addTaskDialog.showModal();
}

/**
 * Fills the task form with existing task data.
 * @param {HTMLFormElement} form - Add/Edit Task form.
 * @param {Object} task - Existing task.
 * @returns {void}
 */
function fillFormElementsWithTaskData(task) {
  removeSelectedClassFromPriorityButtons();
  initPriorityButtonClickListeners();

  const formElements = getFormElements(task.priority);
  formElements.taskTitleInputElement.value = task.title;
  formElements.taskDescriptionElement.value = task.description;
  formElements.dueDateElement.value = task.dueDate;
  formElements.selectedPriorityButton.classList.add("selected");
  formElements.categorySelectElement.value = task.category;
  
  document.getElementById('add-task-title').textContent = "Edit task";
  document.getElementById('btn-create-task').textContent = "Ok";
}

/**
 * Opens the task form in edit mode.
 * @param {Object} task - Task to edit.
 * @returns {void}
 */
async function openAddTaskDialogInEditMode(task) {
  const addTaskDialog = document.getElementById("add-task-dialog");
  editingTaskId = task.id;
  newTaskCategory = task.status;
  addTaskDialog.innerHTML = getAddTaskDialogContentTemplate();
  const taskForm = getTaskForm();
  taskForm.classList.add(dialogModes.editTaskMode);
  await renderAssignedContacts(taskForm);
  fillFormElementsWithTaskData(task);
  initPriorityButtonClickListeners();
  clickEventListener(addTaskDialog);
  addTaskDialog.showModal();
}

/**
 * Closes and clears the Add Task dialog.
 * @returns {void}
 */
function closeAddTaskDialog() {
  const addTaskDialog = document.getElementById("add-task-dialog");
  if (!addTaskDialog) return;
  editingTaskId = "";
  addTaskDialog.close();
  addTaskDialog.innerHTML = "";
}

async function submitEditedTask() {
  const taskIndex = allTasks.findIndex(({ id }) => id === editingTaskId);
  if (taskIndex === -1) return;
  const taskToUpdate = allTasks[taskIndex];
  const updatedTask = updateTaskFromForm(taskToUpdate);
  allTasks[taskIndex] = updatedTask;
  await patchData(`tasks/${editingTaskId}`, updatedTask);
  closeAddTaskDialog();
  updateTaskCardContent(updatedTask);
}

function updateTaskCardContent(task) {
  const taskCard = document.getElementById(task.id);
  taskCard.innerHTML = getTaskCardContentTemplate(task);
  setBadgeBackgroundColor();
}

function updateTaskFromForm(currentTask) {
  const taskData = getTaskData();
  return {
    ...currentTask,
    ...taskData,
    id: editingTaskId,    
  };
}

/**
 * Creates the assigned-user rows for a task overlay.
 * @param {Object} task - Task containing assigned users.
 * @returns {string} Assigned-user HTML.
 */
function getOverlayUsersHtml(task) {
  if(!task.assignedContacts) return `<span>No assigned contacts</span>`;
  const users = task.assignedContacts;
  return users.map((contactName) =>
    getTaskOverlayUserTemplate(getInitials(contactName), contactName),
  ).join("");
}

/**
 * Creates the completed subtask rows for a task overlay.
 * @param {string[]|undefined} subtaskTitles - Names of the subtasks.
 * @returns {string} Subtask HTML.
 */
function getOverlaySubtasksHtml(task) {
  const subtasks = task.subtasks;
  if(!subtasks) return "";
  return subtasks.map((subtask, index) => {
    const isChecked = subtask.done;
    return getSubtaskTemplate(subtask, isChecked, task.id, index);
  }).join("");
}

/**
 * Toggles the done state of a subtask in the opened task and updates the completed counter.
 * @param {number} index - Index of the subtask to toggle.
 */

async function toggleSubtask(index, checkbox) {
  const task = allTasks.find(({ id }) => id === openedTaskId);
  const taskIndex = allTasks.findIndex((task) => task.id === openedTaskId);
  if (!task) return;
  task.subtasks[index].done = !task.subtasks[index].done;
  checkbox.checked = task.subtasks[index].done;
  allTasks[taskIndex] = task;
  console.log(allTasks[taskIndex]);  
  await patchData(`tasks/${openedTaskId}/subtasks/${index}`, {
    done: task.subtasks[index].done,
  });

  updateSubtaskProgressOnCard(task.subtasks, openedTaskId);
}

function updateSubtaskProgressOnCard(subtasks, taskID) {
  const progressFillOnCard = document.getElementById('progress-fill-' + taskID);
  const completedSubtasks = countCompletedSubtasks(subtasks);
  const totalSubtasks = subtasks.length;
  const progress = (completedSubtasks / totalSubtasks) * 100;
  const progressCountOnCard = document.getElementById("subtaskcontainer-" + taskID);

  progressFillOnCard.style.width = `${progress}%`;
  progressCountOnCard.innerText = `${completedSubtasks} / ${totalSubtasks} Subtasks`;
}

/**
 * Returns the priority icon matching a task.
 * @param {string} priority - Task priority.
 * @returns {string} Priority icon HTML.
 */
function getOverlayPriorityIcon(priority) {
  if (priority === "urgent") return urgentPriorityTemplate;
  if (priority === "medium") return mediumPriorityTemplate;
  return lowPriorityTemplate;
}

/**
 * Creates the complete HTML for a task overlay.
 * @param {Object} task - Task to display.
 * @returns {string} Task overlay HTML.
 */
function getTaskOverlayHtml(task) {
  const priority = task.priority;
  const subtasksHTML = getOverlaySubtasksHtml(task);
  
  return getTaskOverlayTemplate(task, priority, subtasksHTML);
}

/**
 * Capitalizes the first letter of a text value.
 * @param {string} value - Text to capitalize.
 * @returns {string} Capitalized text.
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Opens the detail overlay for one task.
 * @param {string} taskId - ID of the selected task.
 * @returns {void}
 */
function openTaskCardDialog(taskId) {
  const taskCardDialog = document.getElementById("task-card-dialog");
  const task = allTasks.find((task) => task.id === taskId);
  if (!task) return;
  openedTaskId = taskId;
  taskCardDialog.innerHTML = getTaskOverlayHtml(task);
  if(task.subtasks) setSubtasksCheckedVisually(task);
  setBadgeBackgroundColor();
  clickEventListener(taskCardDialog);
  taskCardDialog.showModal();
  document.body.classList.add('overlay-open');
}

function setSubtasksCheckedVisually(task) {
  const subtasks = task.subtasks;
  subtasks.forEach((subtask, index) => {
    const checkBox = document.querySelector('[data-index-number="' + index + '"]');
    checkBox.checked = subtask.done; 
  });
}

/**
 * Deletes the currently opened task and refreshes the board.
 * @returns {promise}
 */
async function deleteTaskCard(taskCardId) {
  const taskIndex = allTasks.findIndex(({ id }) => id === taskCardId);
  const taskCard = document.getElementById(taskCardId);
  const taskList = document.querySelector('div.task-list[data-status="' + allTasks[taskIndex].status + '"]');
  taskCard.remove();
  allTasks.splice(taskIndex, 1); 
  await deleteData("tasks/" + openedTaskId);
  renderTaskListOnEmptyContent(taskList);
  closeTaskCardDialog();
}

/**
 * Opens the form for the currently displayed task.
 * @returns {void}
 */
function editTaskCard() {
  const task = allTasks.find((task) => task.id === openedTaskId);
  if (!task) return;
  closeTaskCardDialog();
  openAddTaskDialogInEditMode(task);
}

/**
 * Closes the task detail overlay.
 * @returns {void}
 */
function closeTaskCardDialog() {
  const taskCardDialog = document.getElementById("task-card-dialog");
  taskCardDialog.innerHTML = "";
  taskCardDialog.close();
}

document.getElementById('task-card-dialog').addEventListener('close', () =>{
  document.body.classList.remove('overlay-open');
})

/**
 * Handles clicks on cards and overlay closing areas.
 * @param {MouseEvent} event - Document click event.
 * @returns {void}
 */
function handleTaskCardClick(event) {
  const taskCard = event.target.closest(".task-card");

  if (taskCard) openTaskCardDialog(taskCard.dataset.taskId);
  if (event.target.closest(".task-overlay-delete")) deleteTaskCard(openedTaskId);
  if (event.target.closest(".task-overlay-edit")) editTaskCard();
  if (event.target.closest(".task-overlay-close")) closeTaskCardDialog();
}

/**
 * Opens a task card when activated with the keyboard.
 * @param {KeyboardEvent} event - The keyboard event.
 * @returns {void}
 */
function handleTaskCardKeydown(event) {
  const card = event.target.closest(".task-card");
  if (!card || (event.key !== "Enter" && event.key !== " ")) return;

  event.preventDefault();
  openTaskCardDialog(card.dataset.taskId);
}

/**
 * Handles changes on subtask checkboxes inside the overlay.
 * @param {Event} event - Document change event.
 * @returns {void}
 */
function handleSubtaskCheckboxChange(event) {
  if (event.target.classList.contains("subtask-checkbox")) {
    const checkbox = event.target;
    const index = Number(checkbox.dataset.indexNumber);
    toggleSubtask(index, checkbox);
  }
}
