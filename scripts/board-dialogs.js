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

function setTaskFormUsers(select, users = []) {
  Array.from(select.options).forEach((option) => {
    option.selected = users.includes(option.value);
  });
}

document.addEventListener("click", handleTaskCardClick);
document.addEventListener("keydown", handleTaskCardKeydown);
document.addEventListener("change", handleSubtaskCheckboxChange);

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

function processNewCreatedTask() {
  const newTaskData = allTasks[allTasks.length - 1];
  const newTaskElement = createNewTaskElement(newTaskData);
  appendTaskListByNewCreatedTask(newTaskData, newTaskElement);
  addDragEventListenersToCard(newTaskElement);
}

function appendTaskListByNewCreatedTask(newTaskData, newTaskElement) {
  const taskList = document.querySelector(
    'div.task-list[data-status="' + newTaskData.status + '"]',
  );
  if (!isEmptyTaskListElementInTaskList(taskList)) {
    taskList.appendChild(newTaskElement);
  } else {
    taskList.innerHTML = "";
    taskList.appendChild(newTaskElement);
  }
}

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

document.addEventListener("keydown", (event) => {
  if (event.target.name === "subtask") {
    addSubtaskOnEnter(event);
  }
  if (event.target.name === "subtask-edit") {
    saveSubtaskOnEnter(event);
  }
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
  newTaskStatus = status;
  addTaskDialog.innerHTML = getAddTaskDialogContentTemplate();
  const taskForm = getTaskForm();
  getTaskForm().classList.add(dialogModes.addTaskMode);
  await renderAssignedContacts(taskForm);
  initPriorityButtonClickListeners();
  clickEventListener(addTaskDialog);
  addTaskDialog.showModal();
}

function fillFormElementsWithTaskData(task) {
  removeSelectedClassFromPriorityButtons();
  initPriorityButtonClickListeners();
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
  newTaskSubtasks = (subtasks || []).map((subtask) => subtask.title);
  addTaskDialog.innerHTML = getAddTaskDialogContentTemplate();
  const taskForm = getTaskForm();
  taskForm.classList.add(dialogModes.editTaskMode);
  await renderAssignedContacts(taskForm);
  fillFormElementsWithTaskData(task);
  renderNewSubtasks();
  initPriorityButtonClickListeners();
  clickEventListener(addTaskDialog);
  addTaskDialog.showModal();
}

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
  allTasks[taskIndex] = task;
  await patchData(`tasks/${openedTaskId}/subtasks/${index}`, {
    done: task.subtasks[index].done,
  });

  updateSubtaskProgressOnCard(task.subtasks, openedTaskId);
}

function updateSubtaskProgressOnCard(subtasks, taskID) {
  const progressFillOnCard = document.getElementById("progress-fill-" + taskID);
  const completedSubtasks = countCompletedSubtasks(subtasks);
  const totalSubtasks = subtasks.length;
  const progress = (completedSubtasks / totalSubtasks) * 100;
  const progressCountOnCard = document.getElementById(
    "subtaskcontainer-" + taskID,
  );

  progressFillOnCard.style.width = `${progress}%`;
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
  const taskCard = event.target.closest(".task-card");
  if (taskCard) {
    openTaskCardDialog(taskCard.dataset.taskId);
  }
  if (event.target.closest(".btn-delete-task-card")) {
    deleteTaskCard(openedTaskId);
  }
  if (event.target.closest(".btn-edit-task")) {
    editTaskCard();
  }
  if (event.target.closest(".task-card-dialog-close")) {
    closeTaskCardDialog();
  }
}

function handleTaskCardKeydown(event) {
  const card = event.target.closest(".task-card");
  if (!card || (event.key !== "Enter" && event.key !== " ")) return;
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