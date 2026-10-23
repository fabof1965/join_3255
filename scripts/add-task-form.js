let selectedTaskPriority = "medium";
let editingTaskId = "";
let newTaskCategory = "toDo";
let newTaskSubtasks = [];
const allTasks = [];

document.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.target.closest("dialog")) submitTask(event);
});

/**
 * Selects assigned users in the task form.
 * @param {HTMLSelectElement} select - Assigned users select.
 * @param {string[]} users - User initials to select.
 * @returns {void}
 */

/**
 * Selects one priority button.
 * @param {HTMLButtonElement} button - Clicked priority button.
 * @returns {void}
 */
function selectTaskPriority(button) {
  document.querySelectorAll("[data-priority]").forEach((item) => {
    const selected = item === button;
    item.classList.toggle("selected", selected);
  });
}

/**
 * Renders all entered subtasks below the input.
 * @returns {void}
 */
function renderNewSubtasks() {
  const list = document.querySelector(".add-task-subtasks");
  if (!list) return;
  list.innerHTML = newTaskSubtasks.map((title, index) =>
    getAddTaskSubtaskTemplate(index, title),
  ).join("");
}

/**
 * Adds a subtask value to the current form state.
 * @param {HTMLInputElement} input - Subtask input field.
 * @returns {boolean} Whether a subtask was added.
 */
function addSubtaskFromInput(input) {
  const value = input.value.trim();
  if (!value) return false;
  newTaskSubtasks.push(value);
  input.value = "";
  renderNewSubtasks();
  return true;
}

/**
 * Adds a subtask without submitting the main form.
 * @param {KeyboardEvent} event - Subtask input keyboard event.
 * @returns {void}
 */
function addSubtaskOnEnter(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addSubtaskFromInput(event.target);
}

document.addEventListener('keydown', (event) =>{
  if(event.target.name === "subtask") addSubtaskOnEnter(event);
  if(event.target.name === "subtask-edit") saveSubtaskOnEnter(event);
});

/**
 * Removes the subtask belonging to the clicked delete button and re-renders the list.
 * @param {HTMLElement} button - Clicked delete button inside a subtask item.
 * @returns {void}
 */
async function deleteSubtask(button) {
  const index = Number(button.closest('.subtask-list').dataset.index);
  newTaskSubtasks.splice(index, 1);
  await deleteData('subtasks' + index);
  renderNewSubtasks();
}

/**
 * Replaces the title of the clicked subtask with a focused input field and turns the edit
 * icon into a check icon. Clicking the button again (or pressing Enter) saves the change.
 * @param {HTMLElement} button - Clicked edit button inside a subtask item.
 * @returns {void}
 */

function editSubtask(button) {
  const item = button.closest('.subtask-list');
  const editInput = item.querySelector('.subtask-edit-input');
  if (editInput) return saveSubtask(editInput);
  const index = Number(item.dataset.index);
  const span = item.querySelector('span');
  span.innerHTML = getEditSubtaskTemplate(newTaskSubtasks[index]);
  const handleButtons = item.querySelector('.subtask-button-container');
  handleButtons.style.opacity = 1;
  item.style.backgroundColor = 'transparent';
  button.innerHTML = checkIconSvg;
  item.classList.add('is-editing');
  button.setAttribute('aria-label', 'Save subtask');
  item.querySelector('.subtask-edit-input').focus();
}

/**
 * Saves the edited subtask title when Enter is pressed in the edit input.
 * @param {KeyboardEvent} event - Keydown event of the subtask edit input.
 * @returns {void}
 */
function saveSubtaskOnEnter(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  saveSubtask(event.target);
}

/**
 * Writes the edit input's value back to the subtask and re-renders the list.
 * @param {HTMLInputElement} input - Subtask edit input.
 * @returns {void}
 */
function saveSubtask(input) {
  const index = Number(input.closest('.subtask-list').dataset.index);
  const value = input.value.trim();
  if (value) newTaskSubtasks[index] = value;
  renderNewSubtasks();
}

function resetForm(form = document.getElementById('add-task-form')) {
  if (!form) return;
  form.reset();
  form.querySelectorAll("[data-error]").forEach((error) => { error.textContent = ""; });
  ["title", "dueDate", "category"].forEach((name) =>
    form.elements[name]?.setAttribute("aria-invalid", "false"),
  );
  newTaskSubtasks = [];
  selectedTaskPriority = "medium";
  renderNewSubtasks();
}

/**
 * Displays an error below a required field.
 * @param {HTMLFormElement} form - Add Task form.
 * @param {string} name - Field name.
 * @param {boolean} isInvalid - Whether the field is invalid.
 * @returns {boolean} The invalid state.
 */
function showTaskFieldError(form, name, isInvalid) {
  const field = form.elements[name];
  const error = form.querySelector(`[data-error="${name}"]`);
  if (error) error.textContent = isInvalid ? "This field is required" : "";
  if (field) field.setAttribute("aria-invalid", String(isInvalid));
  return isInvalid;
}

/**
 * Checks all required Add Task fields.
 * @param {HTMLFormElement} form - Add Task form.
 * @returns {boolean} Whether the form is valid.
 */

function isAddTaskFormValid(form) {
  const titleInvalid = !form.elements.title.value.trim();
  const dateInvalid = !form.elements.dueDate.value;
  const categoryInvalid = !form.elements.category.value;
  showTaskFieldError(form, "title", titleInvalid);
  showTaskFieldError(form, "dueDate", dateInvalid);
  showTaskFieldError(form, "category", categoryInvalid);
  return !titleInvalid && !dateInvalid && !categoryInvalid;
}

/**
 * Returns the selected contact initials.
 * @param {HTMLSelectElement} select - Assigned contacts field.
 * @returns {string[]} Selected initials.
 */
function getSelectedUsers(select) {
  return Array.from(select.selectedOptions, ({ value }) => value);
}

/**
 * Returns the names of all selected contacts.
 * @param {HTMLSelectElement} select - Assigned contacts field.
 * @returns {string[]} Selected contact names.
 */
function getSelectedUserNames(select) {
  return Array.from(select.selectedOptions, ({ textContent }) => textContent);
}

function getAssignedContactsFromForm() {
  const select = document.getElementById("assigned-contacts");
  const assignedContacts = [];
  const selectedContacts = select.selectedOptions;

  for(let i = 0; i < selectedContacts.length; i++) {
    assignedContacts.push(selectedContacts[i].innerText);
  }

  return assignedContacts;
}

/**
 * Creates a task object from the form fields.
 * @param {HTMLFormElement} form - Add Task form.
 * @returns {Object} New board task.
 */
function getTaskData() {
  const taskTitleField = document.getElementById("taskTitleInput");
  const taskDescriptionElement = document.getElementById("taskDescription");
  const taskDueDateElement = document.getElementById("taskDueDate");
  const selectedCategory = document.getElementById("taskCategorySelect").selectedOptions[0].innerText;
  const assignedContactsArray = getAssignedContactsFromForm();
  const selectedPriorityText = document.querySelector(".selected").dataset.priority;
  const subtasks = getSubtasksFromForm();

  const taskData = {
    title: taskTitleField.value.trim(),
    description: taskDescriptionElement.value.trim(),
    dueDate: taskDueDateElement.value,
    category: selectedCategory,
    status: "inProgress",
    assignedContacts:  assignedContactsArray,
    priority: selectedPriorityText,
    subtasks: subtasks,
  };

  return taskData;
}

function getSubtasksFromForm() {
  const subtasksElements = document.querySelectorAll(".subtask-wrapper");
  let subtasks = [];
  subtasksElements.forEach((subtaskElement) => {
    subtasks.push(subtaskElement.innerText);
  });

  subtasks = subtasks.map((subtaskTitle) => {
    return {title: subtaskTitle, done: false};
  });
 return subtasks;
}

function calculateSubtaskProgress(totalSubtasks, subtasksDone) {
    return totalSubtasks / subtasksDone;
}

function getSelectedOptionFromForm(select) {
    const option = select.selectedOptions[0];
    const optionText = option ? option.textContent : "";

    return optionText;
}

function getSubtaskProgress() {
  return newTaskSubtasks.length ? { completed: 0, total: newTaskSubtasks.length } : undefined;
}

function getPatchedTaskData(task) {
  const { title, description, dueDate, category, priority, assignedUsers, assignedUserNames,
    subtasks, subtaskTitles, subtaskDone } = task;
  return { title, description, dueDate, category, priority,
    assignedUsers, assignedUserNames, subtasks, subtaskTitles, subtaskDone };
}

/**
 * Saves a new task locally and refreshes the board.
 * @param {SubmitEvent} event - Add Task form submit event.
 * @returns {void}
 */
async function submitTask(event) {
  const form = event.target;
  const taskData = getTaskData();
  console.log(taskData);
  if (!isAddTaskFormValid(form)) return;
  const response = await postData("tasks", taskData);
  if (!response) return;
  const firebaseId = response.name;
  taskData.id = firebaseId;
  allTasks.push(taskData);
  directToBoard("../pages/board.html");
}

function directToBoard(boardURL) {
  if(window.location.pathname !== boardURL) {
    window.location.href = boardURL;
  }
}