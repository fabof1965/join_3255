let selectedTaskPriority = "medium";
let editingTaskId = "";
let newTaskCategory = "toDo";
let newTaskSubtasks = [];

/**
 * Selects assigned users in the task form.
 * @param {HTMLSelectElement} select - Assigned users select.
 * @param {string[]} users - User initials to select.
 * @returns {void}
 */
function setTaskFormUsers(select, users = []) {
  Array.from(select.options).forEach((option) => {
    option.selected = users.includes(option.value);
  });
}

/**
 * Selects one priority button.
 * @param {HTMLButtonElement} button - Clicked priority button.
 * @returns {void}
 */
function selectTaskPriority(button) {
  document.querySelectorAll("[data-priority]").forEach((item) => {
    const selected = item === button;
    item.classList.toggle("selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  selectedTaskPriority = button.dataset.priority;
}

/**
 * Renders all entered subtasks below the input.
 * @returns {void}
 */
function renderNewSubtasks() {
  const list = document.querySelector(".add-task-subtasks");
  if (!list) return;
  list.innerHTML = newTaskSubtasks.map((title, index) =>
    fillTemplate(addTaskSubtaskTemplate, { title, index }),
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
 * Replaces the title of the clicked subtask with an input field; Enter saves the change.
 * @param {HTMLElement} button - Clicked edit button inside a subtask item.
 * @returns {void}
 */
function editSubtask(button) {
  const item = button.closest('.subtask-list');
  const index = Number(item.dataset.index);
  const span = item.querySelector('span');
  span.innerHTML = fillTemplate(editSubtaskTemplate, { title: newTaskSubtasks[index] });
  const input = document.querySelector('.subtask-edit-input');
  input.focus();
}

/**
 * Saves the edited subtask title when Enter is pressed in the edit input.
 * @param {KeyboardEvent} event - Keydown event of the subtask edit input.
 * @returns {void}
 */
function saveSubtaskOnEnter(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const index = Number(event.target.closest('.subtask-list').dataset.index);
  const value = event.target.value.trim();
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

/**
 * Creates a task object from the form fields.
 * @param {HTMLFormElement} form - Add Task form.
 * @returns {Object} New board task.
 */
function createTaskFromForm(form) {
  addPendingSubtask(form);
  const data = new FormData(form);
  //data soll ein Objekt in etwa dieser Form sein: 
// {
//     title: document.querySelector(".task-title-input").value.trim(), 
//     description: document.querySelector(".task-description-input").value.trim(),
//     dueDate: document.querySelector(".add-task-date-input").value, 
//     category: getSelectedOptionFromForm(document.querySelector("task-category-select")), 
//     priority: selectedTaskPriority, 
//     assignedUsers: getSelectedUsers(assignedUsers),
//     subtasks: getSubtasksFromForm,
//     subtaskTitles: [...newTaskSubtasks], 
//     subtaskDone: newTaskSubtasks.map(() => false),
//   };
  return buildTaskData(data, form.elements.assignedUsers);
}

function calculateSubtaskProgress(totalSubtasks, subtasksDone) {
    return totalSubtasks / subtasksDone;
}

function getSelectedOptionFromForm(select) {
    const option = select.selectedOptions[0];
    const optionText = option ? option.textContent : "";

    return optionText;
}

function getSubtasksFromForm() {
    const subtaskTitles = document.querySelectorAll(".subtaskTitle");
    const subtaskCheckboxes = "";
    const subtasks = subtaskTitles.map((title) => {
        const subtaskTitle = title;
        const subtaskDone = "";
    });
}

/**
 * Includes a subtask that is still typed into the input when the form is submitted.
 * @param {HTMLFormElement} form - Add Task form.
 * @returns {void}
 */
function addPendingSubtask(form) {
  if (form.elements.subtask) addSubtaskFromInput(form.elements.subtask);
}

function buildTaskData(data, assignedUsers) {
  return {
    title: data.get("title").trim(), 
    description: data.get("description").trim(),
    dueDate: data.get("dueDate"), 
    category: data.get("category"), 
    status: newTaskCategory,
    priority: selectedTaskPriority, 
    assignedUsers: getSelectedUsers(assignedUsers),
    assignedUserNames: getSelectedUserNames(assignedUsers), 
    subtasks: getSubtaskProgress(),
    subtaskTitles: [...newTaskSubtasks], 
    subtaskDone: newTaskSubtasks.map(() => false),
  };
}

function getSubtaskProgress() {
  return newTaskSubtasks.length ? { completed: 0, total: newTaskSubtasks.length } : undefined;
}

function updateTaskFromForm(currentTask, form) {
  const taskData = createTaskFromForm(form);
  return { 
            ...currentTask,
            ...taskData, 
            id: editingTaskId, 
            status: currentTask.status,
            fullDescription: taskData.description 
          };
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
async function submitNewTask(event) {
  event.preventDefault();
  const form = event.target;
  if (!isAddTaskFormValid(form)) return;
  const task = createTaskFromForm(form);
  const response = await postData("tasks", task);
  if (!response) return;
  const firebaseId = response.name;
  task.id = firebaseId;
  finishTaskSubmission(form, task);
}

/**
 * Cleans up the matching Add Task surface after a task was created.
 * @param {HTMLFormElement} form - Submitted Add Task form.
 * @param {Object} task - Created task with Firebase id.
 * @returns {void}
 */
function finishTaskSubmission(form, task) {
  if (typeof allTasks !== "undefined") allTasks.push(task);

  resetForm(form);
}