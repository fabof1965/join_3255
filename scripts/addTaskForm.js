/**
 * @description Global state variables for task management.
 */
let selectedTaskPriority = "medium";
let editingTaskId = "";
let newTaskStatus = "toDo";
let newTaskSubtasks = [];
const allTasks = [];
let firebaseContacts = [];

/**
 * @description Event listener triggered when the DOM is fully loaded.
 * Initializes the add-task form and its contacts if the user is on the addTask page.
 */
document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.endsWith("/pages/addTask.html")) {
    const addTaskForm = document.getElementById("add-task-form");
    await initContactsOnForm(addTaskForm);
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id !== "add-task-form" || event.target.closest("dialog")) return;
  event.preventDefault();
  const saved = await submitTask(event, null);
  if (!saved) return;
  showSuccessPopup("Task successfully created");
  setTimeout(() => {
    directToPage("../pages/board.html");
  }, 1500);
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".priority-btn")) {
    removeSelectedClassFromPriorityButtons();
    event.target.closest(".priority-btn").classList.add("selected");
  }
});

const btnCleartaskForm = document.getElementById("btn-clear-task-form");
if (btnCleartaskForm) {
  btnCleartaskForm.addEventListener("click", () => resetForm());
}

/**
 * @description Removes the "selected" class from all priority buttons.
 */
function removeSelectedClassFromPriorityButtons() {
  document.querySelectorAll("[data-priority]").forEach((priorityButton) => {
    priorityButton.classList.remove("selected");
  });
}

/**
 * @description Loads all contacts from Firebase and adds the database id to each one.
 * @returns {Promise<Array<{id: string, email: string, phone: string}>>}
 * Array of contact objects, or an empty array if no contact exists.
 */
async function getAllContactsFromFirebase() {
  const response = await getData("contacts");
  if (!response) return [];
  return Object.entries(response).map(([id, contact]) => ({
    id,
    ...contact,
  }));
}

/**
 * @description Fetches contacts from Firebase if not already cached, sorts them alphabetically by name,
 * renders them inside the given task form, and initializes their checkbox event listeners.
 * @param {HTMLFormElement} addTaskForm - The form element where the contacts should be rendered.
 * @returns {Promise<void>}
 */
async function initContactsOnForm(addTaskForm) {
  if (firebaseContacts.length === 0) firebaseContacts = await getAllContactsFromFirebase();
  sortContactsByName(firebaseContacts);
  renderFirebaseContacts(addTaskForm, firebaseContacts);
  initContactCheckboxListeners(firebaseContacts);
}

/**
 * @description Renders the assigned contacts as options into the hidden select.
 * @param {HTMLElement} container - Form element containing the `#assigned-contacts` select.
 */
function renderFirebaseContacts(container, firebaseContacts) {
  const contactDropdown = container.querySelector(".assigned-dropdown-list");
  contactDropdown.innerHTML = firebaseContacts.map((contact) => {
    return getAssignedContactOptionTemplate(getInitials(contact.name), contact.name)
  }).join("");
  setBadgeBackgroundColor();
}

/**
 * @description Initializes click and keyboard event listeners for contact checkboxes.
 * Updates the ARIA checked attribute on click and allows toggling via the Enter key for accessibility.
 * @param {Array<Object>} firebaseContacts - Array of contact objects containing at least a name property.
 * @returns {void}
 */
function initContactCheckboxListeners(firebaseContacts) {
  firebaseContacts.forEach((contact) => {
    const checkboxForContact = document.getElementById('chk-box-' + contact.name);
    checkboxForContact.addEventListener("click", () => {
      checkboxForContact.setAttribute("aria-checked", checkboxForContact.checked);
    });
    checkboxForContact.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      checkboxForContact.checked = !checkboxForContact.checked;
      checkboxForContact.setAttribute("aria-checked", checkboxForContact.checked);
    });
  });
}

/**
 * @description Renders the list of new subtasks.
 */
function renderNewSubtasks() {
  const list = document.querySelector(".add-task-subtasks");
  if (!list) return;
  list.innerHTML = newTaskSubtasks
    .map((subtask, index) => {
      return getAddTaskSubtaskTemplate(index, subtask.title);
    }).join("");
  addButtonEventListenersOnSubtask();
}

/**
 * @description Adds a click listeners to the edit and delete buttons that of every subtask in the list.
 * The edit button calls `editSubtask`, the delete button calls `deleteSubtask`.
 */
function addButtonEventListenersOnSubtask() {
  let subtaskIndex = 0;
  newTaskSubtasks.forEach(() => {
    const editButton = document.querySelector('[data-edit-index="' + subtaskIndex + '"]');
    const deleteButton = document.querySelector('[data-delete-index="' + subtaskIndex + '"]');
    editButton.addEventListener("click", () => editSubtask(editButton));
    deleteButton.addEventListener("click", () => deleteSubtask(deleteButton));
    subtaskIndex++;
  });
}

/**
 * @description Adds a input value as a new subtask and renders the subtask-list.
 * @param {HTMLInputElement} input - Input field containing the subtask title.
 * @returns {boolean} `true` if a subtask was added, `false` if the input was empty.
 */
function addSubtaskFromInput(input) {
  const value = input.value.trim();
  if (!value) return false;
  newTaskSubtasks.push({ title: value, done: false });
  input.value = "";
  renderNewSubtasks();
  return true;
}

/**
 * @description Adds a subtask when the enter key is pressed.
 * @param {KeyboardEvent} event - Keydown event from the subtask input field
 */
function addSubtaskOnEnter(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addSubtaskFromInput(event.target);
  const iconContainer = document.querySelector(".subtask-icon-container");
  iconContainer.style.opacity = 0;
}

/**
 * @description Global keydown event listener that handles Enter-key actions 
 * for subtask inputs, triggering either creation or saving depending on the input field name.
 */
document.addEventListener("keydown", (event) => {
  if (event.target.name === "subtask") addSubtaskOnEnter(event);
  if (event.target.name === "subtask-edit") saveSubtaskOnEnter(event);
});

/**
 * @description Removes subtask when the trash icon is clicked.
 * @param {HTMLButtonElement} button - The delete button inside the subtask list item that was clicked.
 */
function deleteSubtask(button) {
  const index = Number(button.closest(".subtask-list").dataset.index);
  newTaskSubtasks.splice(index, 1);
  renderNewSubtasks();
}

/**
 * @description Toggles the edit mode of a subtask: opens the edit input, or saves it if already open.
 * @param {HTMLButtonElement} button - The edit button inside the subtask list item that was clicked. 
 */
function editSubtask(button) {
  const item = button.closest(".subtask-list");
  const editInput = item.querySelector(".subtask-edit-input");
  if (editInput) return saveSubtask(editInput);
  const index = Number(item.dataset.index);
  const span = item.querySelector("span");
  span.innerHTML = getEditSubtaskTemplate(newTaskSubtasks[index].title);
  const handleButtons = item.querySelector(".subtask-button-container");
  handleButtons.style.opacity = 1;
  item.style.backgroundColor = "transparent";
  button.innerHTML = checkIconSvg;
  item.classList.add("is-editing");
  button.setAttribute("aria-label", "Save subtask");
  item.querySelector(".subtask-edit-input").focus();
}

/**
 * @description Saves subtask when the enter key is pressed.
 * @param {KeyboardEvent} event - Keydown event from the subtask input field.
 */
function saveSubtaskOnEnter(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  saveSubtask(event.target);
}

/**
 * @description Saves a subtask in the subtask list and renders the list.
 * @param {HTMLInputElement} input - Input field containing the subtask title.  
 */
function saveSubtask(input) {
  const index = Number(input.closest(".subtask-list").dataset.index);
  const value = input.value.trim();
  if (value) newTaskSubtasks[index].title = value;
  renderNewSubtasks();
}

/**
 * Shows and hides the edit and clear button.
 * @param {InputEvent} event - Input event that is fired on the `document`. 
 */
function toggleSubtaskIcons(event) {
  if (event.target.id !== "board-subtask-input") return;
  const icons = event.target.parentElement.querySelector('.subtask-icon-container');
  icons.style.opacity = 1;
  const input = document.getElementById('board-subtask-input');
  if (input.value === "") icons.style.opacity = 0;
}

function saveSubtaskOnClick(event) {
  if (!event.target.closest("#save-subtask-icon")) return;
  const iconContainer = document.querySelector(".subtask-icon-container");
  const input = document.getElementById('board-subtask-input');
  addSubtaskFromInput(input);
  iconContainer.style.opacity = 0;
}

function clearSubtaskValue(event) {
  if (!event.target.closest('#clear-subtask-icon')) return;
  const input = document.getElementById('board-subtask-input');
  const iconContainer = document.querySelector(".subtask-icon-container");
  input.value = "";
  iconContainer.style.opacity = 0;
}

document.addEventListener('click', clearSubtaskValue);
document.addEventListener('click', saveSubtaskOnClick);
document.addEventListener('input', toggleSubtaskIcons);
document.addEventListener('click', closeAssignedDropdownOnOutsideClick);

/** 
 * Closes all open assigned-contacts dropdowns when the click happened outside of them.
 * @param {MouseEvent} event - The click event on the document.
 */
function closeAssignedDropdownOnOutsideClick(event) {
  document.querySelectorAll('.assigned-dropdown[open]').forEach((dropdown) => {
    if (!dropdown.contains(event.target)) dropdown.removeAttribute('open');
  });
}

/**
 * @description Reads the selected contacts from the “Assigned to” select element and return  their displayed names.
 * @returns {string[]} Names of the selected contacts. Empty array if no contact has been selected.
 */
function getAssignedContactsFromForm() {
  const assignedContactList = document.querySelector(".assigned-dropdown-list");
  const assignedContactChildren = assignedContactList.children;
  const assignedContacts = [];
  for (let i = 0; i < assignedContactChildren.length; i++) {
    const contactCheckBox = assignedContactChildren[i].children[0].children[1];
    if (contactCheckBox.checked) {
      const contactName = contactCheckBox.dataset.contactName;
      assignedContacts.push(contactName);
    }
  }
  return assignedContacts;
}

/**
 * @description Reads the add-task form values and return them as a task object.
 * @returns {object} The task data.
 */
function getTaskData() {
  const formElements = getFormElements();
  const subtasks = getSubtasksFromForm();
  const taskData = {
    title: formElements.taskTitleInputElement.value.trim(),
    description: formElements.taskDescriptionElement.value.trim(),
    dueDate: formElements.dueDateElement.value,
    category: formElements.categorySelectElement.selectedOptions[0].innerText,
    status: newTaskStatus,
    assignedContacts: getAssignedContactsFromForm(),
    priority: document.querySelector(".selected").dataset.priority,
    subtasks: subtasks
  };
  return taskData;
}

/**
 * @description Returns the DOM elements of the add-task form fields.
 * @param {string} priority - Priority value used to find the matching priority button.
 * @returns {object} Object containing the form field elements. 
 */
function getFormElements(priority = "") {
  return {
    taskTitleInputElement: document.getElementById("taskTitleInput"),
    taskDescriptionElement: document.getElementById("taskDescription"),
    dueDateElement: document.getElementById("taskDueDate"),
    selectedPriorityButton: document.querySelector('[data-priority="' + priority + '"]'),
    assignedContactsSelectElement: document.getElementById("assigned-contacts"),
    categorySelectElement: document.getElementById("taskCategorySelect"),
  };
}

/**
 * @description Returns a copy of the current subtasks from the form.
 * The data comes from the global variable `newTaskSubtasks`.
 * @returns {{title: string, done: boolean} []}
 */
function getSubtasksFromForm() {
  return newTaskSubtasks.map((subtask) => ({ ...subtask, }));
}

/**
 * @description Validates the data from the add-task form and saves it to Firebase
 * @param {SubmitEvent} event - Submit event of the add-task-form. 
 * @param {Object|null} editedTask - Task to update, or null to create a new one.
 * @returns {Promise <boolean>} True if the task was saved, false if the form ist invalid.
 */
async function submitTask(event, editedTask) {
  const form = event.target;
  if (!isAddTaskFormValid(form)) return false;
  if (editedTask === null) {
    const taskData = getTaskData();
    const response = await postData("tasks", taskData);
    const firebaseId = response.name;
    taskData.id = firebaseId;
    await patchData(`tasks/${taskData.id}`, taskData);
    allTasks.push(taskData);
    return true;
  }
  await patchData(`tasks/${editedTask.id}`, editedTask);
  return true;
}

/**
 * @description Redirects to the page url if the page with specified url if it isn't already open.
 * @param {string} pageURL - Path to the specified page.
 */
function directToPage(pageURL) {
  if (window.location.pathname !== pageURL) {
    window.location.href = pageURL;
  }
}