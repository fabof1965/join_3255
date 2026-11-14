const dialogModes = {
  addTaskMode: "add-task",
  editTaskMode: "edit-task",
};

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

document.addEventListener("click", handleTaskCardClick);
document.addEventListener("keydown", handleTaskCardKeydown);
document.addEventListener("change", handleSubtaskCheckboxChange);
document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    handleSubtaskCheckboxChange(event);
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (form.classList.contains(dialogModes.addTaskMode)) {
    event.preventDefault();
    const saved = await submitTask(event, null);
    if (!saved) return;
    processNewCreatedTask();
    closeAddTaskDialog();
    showSuccessPopup("Task successfully created");
    return;
  }
  if (form.classList.contains(dialogModes.editTaskMode)) {
    event.preventDefault();
    submitEditedTask(event);
    closeAddTaskDialog();
    return;
  }
});

/**
 * @description Renders the most recently created task as a card in its matching board column
 *  and enables drag and drop for it.
 */
function processNewCreatedTask() {
  const newTaskData = allTasks[allTasks.length - 1];
  const newTaskElement = createNewTaskElement(newTaskData);
  appendTaskListByTaskElement(newTaskData, newTaskElement);
  addDragEventListenersToCard(newTaskElement);
}

/**
 * @description Appends a task card to the task list matching its status.
 * If the list only contains the "empty" placeholder, the placeholder is removed first.
 * @param {object} taskData - Data of the task.
 * @param {HTMLElement} taskCardElement - The task card element to insert into the list.
 */
function appendTaskListByTaskElement(taskData, taskCardElement) {
  const taskList = document.querySelector(
    'div.task-list[data-status="' + taskData.status + '"]'
  );
  if (!isEmptyTaskListElementInTaskList(taskList)) {
    taskList.appendChild(taskCardElement);
  } else {
    taskList.innerHTML = "";
    taskList.appendChild(taskCardElement);
  }
}

/**
 * @description Creates a new Task HTML-Element from the given task data
 * @param {object} newTaskData The task's data 
 * @returns {HTML Element article} The new task HTML element with all information it needs to be processed.
 */
function createNewTaskElement(newTaskData) {
  const newTaskElement = document.createElement("article");
  newTaskElement.id = newTaskData.id;
  newTaskElement.classList.add("task-card");
  newTaskElement.role = "button";
  newTaskElement.tabIndex = "0";
  newTaskElement.ariaLabel = "Open task " + newTaskData.title;
  newTaskElement.draggable = "true";
  newTaskElement.dataset.taskId = newTaskData.id;
  newTaskElement.innerHTML = getTaskCardContentTemplate(newTaskData);
  return newTaskElement;
}

document.getElementById("btn-add-task").addEventListener("click", () => {
  openAddTaskDialog("toDo");
});

addClickEventListenersToTaskCategoryButtons();

/**
 @description Adds click listeners to the "+" buttons of the columns "To do", "In progress"
 * and "Await feedback" that open the add-task dialog with the matching status.
 */
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
  newTaskStatus = status;
  addTaskDialog.innerHTML = getAddTaskDialogContentTemplate();
  const taskForm = getTaskForm();
  getTaskForm().classList.add(dialogModes.addTaskMode);
  await initContactsOnForm(taskForm);
  initAddTaskDialogListeners(addTaskDialog);
  addTaskDialog.showModal();
}

function initAddTaskDialogListeners(addTaskDialog) {
  initPriorityButtonClickListeners();
  clickEventListener(addTaskDialog);
  document.querySelector(".close-btn").addEventListener("click", () => closeAddTaskDialog());
  document.querySelector(".btn-clear").addEventListener("click", () => resetForm());
}

function fillFormElementsWithTaskData(task) {
  removeSelectedClassFromPriorityButtons();
  initPriorityButtonClickListeners();
  checkContactsFromTask(task);
  const formElements = getFormElements(task.priority);
  formElements.taskTitleInputElement.value = task.title;
  formElements.taskDescriptionElement.value = task.description;
  formElements.dueDateElement.value = task.dueDate;
  formElements.selectedPriorityButton.classList.add("selected");
  formElements.categorySelectElement.value = task.category;
  document.getElementById("add-task-title").textContent = "Edit task";
  document.getElementById("btn-create-task").textContent = "Ok";
}

async function openAddTaskDialogInEditMode(task) {
  const addTaskDialog = document.getElementById("add-task-dialog");
  editingTaskId = task.id;
  newTaskStatus = task.status;
  const subtasks = await getData(`tasks/${task.id}/subtasks`);
  newTaskSubtasks = (subtasks || []).map((subtask) => ({
    ...subtask,
  }));
  addTaskDialog.innerHTML = getAddTaskDialogContentTemplate();
  const taskForm = getTaskForm();
  taskForm.classList.add(dialogModes.editTaskMode);
  await initContactsOnForm(taskForm);
  fillFormElementsWithTaskData(task);
  renderNewSubtasks();
  initAddTaskDialogListeners(addTaskDialog);
  clickEventListener(addTaskDialog);
  addTaskDialog.showModal();
}

/**
 * @description Checks checkboxes for contacts from the contact-array of the given task
 * @param {object} task The task object that includes the task data 
 */
function checkContactsFromTask(task) {
  const contactNames = task.assignedContacts;
  const contactChecked = true;
  contactNames.forEach((contactName) => {
    const contactCheckBox = document.querySelector('[data-contact-name="' + contactName + '"]');
    contactCheckBox.checked = contactChecked;
    contactCheckBox.ariaChecked = contactChecked;
  });
}

/**
 * @description Closes and resets the add task dialog.
 */
function closeAddTaskDialog() {
  const addTaskDialog = document.getElementById("add-task-dialog");
  if (!addTaskDialog) return;
  editingTaskId = "";
  newTaskStatus = "toDo";
  newTaskSubtasks = [];
  addTaskDialog.close();
  addTaskDialog.innerHTML = "";
}

function submitEditedTask(event) {
  const taskIndex = allTasks.findIndex((task) => {
    return task.id === editingTaskId;
  });
  if (taskIndex === -1) return;
  const taskToUpdate = allTasks[taskIndex];
  const updatedTask = updateTaskFromForm(taskToUpdate);
  allTasks[taskIndex] = updatedTask;
  updateTaskCardContent(updatedTask);
  submitTask(event, updatedTask);
}

function updateTaskCardContent(task) {
  const taskCard = document.querySelector(`[data-task-id="${task.id}"]`);
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

function getOverlayUsersHtml(task) {
  if (!task.assignedContacts) {
    return `<span>No assigned contacts</span>`;
  }
  const users = task.assignedContacts;
  return users
    .map((contactName) => {
      return getTaskOverlayUserTemplate(getInitials(contactName), contactName);
    })
    .join("");
}

function getOverlaySubtasksHtml(task) {
  const subtasks = task.subtasks;
  if (!subtasks) return "";
  return subtasks
    .map((subtask, index) => {
      const isChecked = subtask.done;

      return getSubtaskTemplate(subtask, isChecked, task.id, index);
    })
    .join("");
}

async function toggleSubtask(index, checkbox) {
  const task = allTasks.find((task) => task.id === openedTaskId);
  const taskIndex = allTasks.findIndex((task) => task.id === openedTaskId);
  if (!task) return;
  task.subtasks[index].done = !task.subtasks[index].done;
  checkbox.checked = task.subtasks[index].done;
  setCheckedAttributesHTML(index, checkbox);
  allTasks[taskIndex] = task;
  await patchData(`tasks/${openedTaskId}/subtasks/${index}`, {
    done: task.subtasks[index].done,
  });

  updateSubtaskProgressOnCard(task.subtasks, openedTaskId);
}

function setCheckedAttributesHTML(index, checkbox) {
  const checked = checkbox.checked;
  const checkboxElement = document.querySelector('[data-index-number="' + index + '"]');
  checkboxElement.setAttribute("checked", checked);
  checkboxElement.setAttribute("aria-checked", checked);
}

function updateSubtaskProgressOnCard(subtasks, taskID) {
  const progressFillOnCard = document.getElementById("progress-fill-" + taskID);
  const completedSubtasks = countCompletedSubtasks(subtasks);
  const totalSubtasks = subtasks.length;
  const progress = (completedSubtasks / totalSubtasks) * 100;
  const progressCountOnCard = document.getElementById(
    "subtaskcontainer-" + taskID,
  );

  progressFillOnCard.value = progress;
  progressCountOnCard.innerText = `${completedSubtasks} / ${totalSubtasks} Subtasks`;
}

function getOverlayPriorityIcon(priority) {
  if (priority === "urgent") return urgentPriorityTemplate;
  if (priority === "medium") return mediumPriorityTemplate;
  return lowPriorityTemplate;
}

function getTaskOverlayHtml(task) {
  const priority = task.priority;
  const subtasksHTML = getOverlaySubtasksHtml(task);
  return getTaskOverlayTemplate(task, priority, subtasksHTML);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function openTaskCardDialog(taskId) {
  const taskCardDialog = document.getElementById("task-card-dialog");
  const task = allTasks.find((task) => task.id === taskId);
  if (!task) return;
  openedTaskId = taskId;
  taskCardDialog.innerHTML = getTaskOverlayHtml(task);
  if (task.subtasks) {
    setSubtasksCheckedVisually(task);
  }
  setBadgeBackgroundColor();
  clickEventListener(taskCardDialog);
  taskCardDialog.showModal();
  document.body.classList.add("overlay-open");
}

function setSubtasksCheckedVisually(task) {
  const subtasks = task.subtasks;
  subtasks.forEach((subtask, index) => {
    const checkBox = document.querySelector(
      '[data-index-number="' + index + '"]',
    );
    checkBox.checked = subtask.done;
  });
}

async function deleteTaskCard(taskCardId) {
  const taskIndex = allTasks.findIndex((task) => {
    return task.id === taskCardId;
  });
  if (taskIndex === -1) return;
  const taskCard = document.getElementById(taskCardId);
  const taskList = document.querySelector(
    'div.task-list[data-status="' + allTasks[taskIndex].status + '"]',
  );
  await deleteData("tasks/" + taskCardId);
  taskCard.remove();
  allTasks.splice(taskIndex, 1);
  renderTaskListOnEmptyContent(taskList);
  closeTaskCardDialog();
  showSuccessPopup("Task successfully deleted");
}

function editTaskCard() {
  const task = allTasks.find((task) => task.id === openedTaskId);
  if (!task) return;
  closeTaskCardDialog();
  openAddTaskDialogInEditMode(task);
}

function closeTaskCardDialog() {
  const taskCardDialog = document.getElementById("task-card-dialog");
  taskCardDialog.innerHTML = "";
  taskCardDialog.close();
}

document.getElementById("task-card-dialog").addEventListener("close", () => {
  document.body.classList.remove("overlay-open");
});

function handleTaskCardClick(event) {
  console.log(event.target);
  const taskCard = event.target.closest(".task-card");
  const menuOption = event.target.closest(".menu-option");

  if(onOpenPopoverButton(event)) {
    handlePopoverOpenOnTaskCard(event);
    return;
  }
  if(menuOption) {
    handleMenuOption(event);
    return;
  } 
  if (taskCard) openTaskCardDialog(taskCard.dataset.taskId);
  if (event.target.closest(".btn-delete-task-card")) deleteTaskCard(openedTaskId);
  if (event.target.closest(".btn-edit-task")) editTaskCard();
  if (event.target.closest(".task-card-dialog-close")) closeTaskCardDialog();
}

/**
 * @description Checks if we are currently on the button that opens the card's popover-menu.
 * @param {Event} event The event object 
 * @returns {boolean} True if on open popover button, false if not on open popover button.
 */
function onOpenPopoverButton(event) {
  if(event.target.closest(".btn-open-popover-menu"))
    return true;
  else return false;
}

/**
 * @description Prevents eventBubblung and handles the menu-option event by moving the task-card into a new column
 * @param {Event} event The event object 
 */
function handleMenuOption(event) {
  event.stopPropagation();
  const menuOption = event.target.closest(".menu-option");
  const newTaskCategory = menuOption.dataset.moveTo;
  const taskId = menuOption.dataset.taskId;
  moveToStatus(event, taskId, newTaskCategory);
}

function handlePopoverOpenOnTaskCard(event) {
  if(onOpenPopoverButton(event)) {
    event.stopPropagation();
    return;
  }
}

function handleTaskCardKeydown(event) {
  console.log(event.target);
  const card = event.target.closest(".task-card");
  const menuOption = event.target.closest(".menu-option");
  if (!card || (event.key !== "Enter" && event.key !== " ")) return;
  if(onOpenPopoverButton(event)) {
    handlePopoverOpenOnTaskCard(event);
    return;
  }
  if(menuOption) {
    handleMenuOption(event);
    return;
  }
  event.preventDefault();
  openTaskCardDialog(card.dataset.taskId);
}

function handleSubtaskCheckboxChange(event) {
  if (event.target.classList.contains("subtask-checkbox")) {
    const checkbox = event.target;
    const index = Number(checkbox.dataset.indexNumber);
    toggleSubtask(index, checkbox);
  }
}