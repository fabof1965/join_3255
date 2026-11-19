/**
 * @description Object defining the possible operation modes for the task dialog.
 * @type {{ addTaskMode: string, editTaskMode: string }}
 */
const dialogModes = {
  addTaskMode: "add-task",
  editTaskMode: "edit-task",
};

/**
 * @description Global event listeners for managing task card interactions,
 * subtask checkbox changes, and keyboard accessibility (Enter key support).
 */
document.addEventListener("click", handleTaskCardClick);
document.addEventListener("keydown", handleTaskCardKeydown);
document.addEventListener("change", handleSubtaskCheckboxChange);
document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    handleSubtaskCheckboxChange(event);
  }
});

/**
 * @description Global submit event listener that handles form submissions for both
 * creating new tasks (with validation, success popup, and dialog closure) and editing existing tasks.
 */
document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (form.classList.contains(dialogModes.addTaskMode)) {
    event.preventDefault();
    const saved = await submitTask(event, null);
    if (!saved) return;
    processNewCreatedTask();
    showSuccessPopup("Task successfully created");
  }
  if (form.classList.contains(dialogModes.editTaskMode)) {
    event.preventDefault();
    submitEditedTask(event);
  }
  closeAddTaskDialog();
});

/**
 * @description Renders the most recently created task as a card in its matching board column
 *  and enables drag and drop for it.
 */
function processNewCreatedTask() {
  const newTaskData = allTasks[allTasks.length - 1];
  const newTaskElement = createNewTaskElement(newTaskData);
  appendTaskListByTaskElement(newTaskData, newTaskElement);
}

/**
 * @description Appends a task card to the task list matching its status.
 * If the list only contains the "empty" placeholder, the placeholder is removed first.
 * @param {object} taskData - Data of the task.
 * @param {HTMLElement} taskCardElement - The task card element to insert into the list.
 */
function appendTaskListByTaskElement(taskData, taskCardElement) {
  const taskList = document.querySelector('div.task-list[data-status="' + taskData.status + '"]');
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

addClickEventListenersToTaskCategoryButtons();

/**
 @description Adds click listeners to the "+" buttons of the columns "To do", "In progress"
 * and "Await feedback" that open the add-task dialog with the matching status.
 */
function addClickEventListenersToTaskCategoryButtons() {
  document.addEventListener("click", (event) => {
    if (event.target.closest(".status-btn")) {
      const statusBtn = event.target.closest(".status-btn");
      const status = statusBtn.dataset.addTaskStatus;
      openAddTaskDialog(status);
    }
  });
}

/**
 * @description Retrieves the add-task form element from the DOM.
 * @returns {HTMLFormElement | null} The add-task form element, or null if it does not exist.
 */
function getTaskForm() {
  return document.querySelector("#add-task-form");
}

/**
 * @description Opens the add-task dialog with the specified status, injects the template content,
 * initializes the form, loads and renders contacts, sets up dialog listeners, and opens the modal.
 * @param {string} status - The initial status for the new task (e.g., "toDo", "inProgress").
 * @returns {Promise<void>}
 */
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

/**
 * @description Initializes all interactive event listeners for the add-task dialog,
 * including priority buttons, general dialog container clicks, close button, and form reset.
 * @param {HTMLElement} addTaskDialog - The dialog element containing the add-task interface.
 * @returns {void}
 */
function initAddTaskDialogListeners(addTaskDialog) {
  closeDialogOnOutsideClick(addTaskDialog);
  document.querySelector(".close-btn").addEventListener("click", () => closeAddTaskDialog());
  document.querySelector(".btn-clear").addEventListener("click", () => resetForm());
}

/**
 * @description Populates the task form input elements and UI controls with data from an existing task
 * when opening the dialog in edit mode. Sets up priority buttons, checks associated contacts,
 * fills in text fields, dates, and category selections, and updates dialog headers and buttons.
 * @param {Object} task - The task object containing the data to populate the form with.
 * @returns {void}
 */
function fillFormElementsWithTaskData(task) {
  removeSelectedClassFromPriorityButtons();
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

/**
 * @description Opens the task dialog in edit mode for an existing task, sets global editing states,
 * fetches and maps associated subtasks from the database, renders the dialog content and form elements,
 * populates them with existing task data, and opens the modal.
 * @param {Object} task - The task object containing the ID, status, and details of the task to be edited.
 * @returns {Promise<void>}
 */
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
  closeDialogOnOutsideClick(addTaskDialog);
  addTaskDialog.showModal();
}

/**
 * @description Checks checkboxes for contacts from the contact-array of the given task
 * @param {object} task The task object that includes the task data
 */
function checkContactsFromTask(task) {
  const contactNames = task.assignedContacts;
  const contactChecked = true;
  if (!contactNames) return;
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

/**
 * @description Handles the submission of an edited task. Finds the task in the global list by its ID,
 * updates its properties from the form data, updates the local task array and task card UI,
 * and sends the updated task data to be persisted.
 * @param {Event} event - The form submission event.
 * @returns {void}
 */
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

/**
 * @description Updates the HTML content and UI of an existing task card in the DOM
 * using the latest task data, and refreshes badge background colors.
 * @param {Object} task - The updated task object containing the ID and details to render.
 * @returns {void}
 */
function updateTaskCardContent(task) {
  const taskCard = document.querySelector(`[data-task-id="${task.id}"]`);
  taskCard.innerHTML = getTaskCardContentTemplate(task);
  setBadgeBackgroundColor();
}

/**
 * @description Updates an existing task object by merging current task properties with new data retrieved from the form,
 * while preserving the editing task ID.
 * @param {Object} currentTask - The original task object before updates.
 * @returns {Object} The newly updated task object containing the combined properties.
 */
function updateTaskFromForm(currentTask) {
  const taskData = getTaskData();
  return {
    ...currentTask,
    ...taskData,
    id: editingTaskId,
  };
}

/**
 * @description Opens the detailed task card modal dialog, populates it with task data, sets up visual states, and dims the background board container.
 * @param {string|number} taskId - The unique identifier of the task to open.
 * @returns {void}
 */
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
  closeDialogOnOutsideClick(taskCardDialog);
  taskCardDialog.showModal();
  document.querySelector(".board-container").classList.add("overlay-open");
}

/**
 * @description Deletes a task card from the server, removes it from the local array and DOM,
 * updates the list layout, closes the dialog, and shows a success notification.
 * @param {string|number} taskCardId - The unique identifier of the task card to delete.
 * @returns {Promise<void>}
 */
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
  taskCard?.remove();
  allTasks.splice(taskIndex, 1);
  renderTaskListOnEmptyContent(taskList);
  closeTaskCardDialog();
  showSuccessPopup("Task successfully deleted");
}

/**
 * @description Closes the task detail dialog and opens the add task dialog pre-filled in edit mode for the currently opened task.
 * @returns {void}
 */
function editTaskCard() {
  const task = allTasks.find((task) => task.id === openedTaskId);
  if (!task) return;
  closeTaskCardDialog();
  openAddTaskDialogInEditMode(task);
}

/**
 * @description Clears the content of the task card dialog and closes the modal element.
 * @returns {void}
 */
function closeTaskCardDialog() {
  const taskCardDialog = document.getElementById("task-card-dialog");
  taskCardDialog.innerHTML = "";
  taskCardDialog.close();
}

document.getElementById("task-card-dialog").addEventListener("close", () => {
  document.querySelector(".board-container").classList.remove("overlay-open");
});

/**
 * @description Handles click events on task cards, delegating actions to popovers, menu options, dialog openers, deletion, editing, or closing.
 * @param {MouseEvent} event - The click event object.
 * @returns {void}
 */
function handleTaskCardClick(event) {
  const taskCard = event.target.closest(".task-card");
  const menuOption = event.target.closest(".menu-option");
  if (onOpenPopoverButton(event)) {
    handlePopoverOpenOnTaskCard(event);
    return;
  }
  if (menuOption) {
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
  if (event.target.closest(".btn-open-popover-menu"))
    return true;
  else return false;
}
