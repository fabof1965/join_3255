let newTaskStatus = "toDo";
let selectedTaskPriority = "medium";
let newTaskSubtasks = [];
let editingTaskId = "";

/**
 * Opens the Add Task dialog for a board column.
 * @param {string} status - Initial board column status.
 * @returns {void}
 */

async function openAddTask(status) {
  const overlay = document.getElementById("add-task-overlay");
  editingTaskId = "";
  newTaskStatus = status;
  selectedTaskPriority = "medium";
  newTaskSubtasks = [];
  overlay.innerHTML = addTaskDialogTemplate;
  await renderAssignedContacts();
  overlay.hidden = false;
  document.body.classList.add("overlay-open");
  overlay.querySelector("input[name='title']").focus();
}

/**
 * Converts escaped task text back to readable form for form fields.
 * @param {string} value - Stored task text.
 * @returns {string} Plain text value.
 */
function decodeTaskText(value = "") {
  const element = document.createElement("textarea");
  element.innerHTML = value;
  return element.value;
}

/**
 * Selects the saved priority inside the task form.
 * @param {HTMLFormElement} form - Add/Edit Task form.
 * @param {string} priority - Priority value.
 * @returns {void}
 */
function setTaskFormPriority(form, priority = "medium") {
  selectedTaskPriority = priority;
  form.querySelectorAll("[data-priority]").forEach((button) =>
    button.classList.toggle("selected", button.dataset.priority === priority),
  );
}

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
 * Fills the task form with existing task data.
 * @param {HTMLFormElement} form - Add/Edit Task form.
 * @param {Object} task - Existing task.
 * @returns {void}
 */
function fillTaskForm(form, task) {
  form.elements.title.value = decodeTaskText(task.title);
  form.elements.description.value = decodeTaskText(task.fullDescription || task.description);
  form.elements.dueDate.value = task.dueDate || "";
  form.elements.category.value = task.category || "";
  setTaskFormPriority(form, task.priority);
  setTaskFormUsers(form.elements.assignedUsers, task.assignedUsers);
  newTaskSubtasks = [...(task.subtaskTitles || [])];
  renderNewSubtasks();
}

/**
 * Opens the task form in edit mode.
 * @param {Object} task - Task to edit.
 * @returns {void}
 */
async function openEditTask(task) {
  const overlay = document.getElementById("add-task-overlay");
  editingTaskId = task.id;
  newTaskStatus = task.status;
  overlay.innerHTML = addTaskDialogTemplate;
  await renderAssignedContacts();
  overlay.hidden = false;
  document.body.classList.add("overlay-open");
  overlay.querySelector("#add-task-title").textContent = "Edit Task";
  overlay.querySelector(".create-task-button").textContent = "Save Task";
  fillTaskForm(overlay.querySelector("#add-task-form"), task);
  overlay.querySelector("input[name='title']").focus();
}

/**
 * Closes and clears the Add Task dialog.
 * @returns {void}
 */
function closeAddTask() {
  const overlay = document.getElementById("add-task-overlay");
  overlay.hidden = true;
  overlay.innerHTML = "";
  editingTaskId = "";
  document.body.classList.remove("overlay-open");
}

/**
 * Selects one priority button.
 * @param {HTMLButtonElement} button - Clicked priority button.
 * @returns {void}
 */
function selectTaskPriority(button) {
  document.querySelectorAll("[data-priority]").forEach((item) =>
    item.classList.toggle("selected", item === button),
  );
  selectedTaskPriority = button.dataset.priority;
}

/**
 * Renders all entered subtasks below the input.
 * @returns {void}
 */
function renderNewSubtasks() {
  const list = document.querySelector(".add-task-subtasks");
  list.innerHTML = newTaskSubtasks.map((title) =>
    fillTemplate(addTaskSubtaskTemplate, { title }),
  ).join("");
}

/**
 * Adds a subtask without submitting the main form.
 * @param {KeyboardEvent} event - Subtask input keyboard event.
 * @returns {void}
 */
function addSubtaskOnEnter(event) {
  if (event.key !== "Enter" || !event.target.value.trim()) return;
  event.preventDefault();
  newTaskSubtasks.push(escapeTaskText(event.target.value.trim()));
  event.target.value = "";
  renderNewSubtasks();
}

/**
 * Escapes text before inserting it into an HTML template.
 * @param {string} value - User-entered text.
 * @returns {string} Safe text for HTML output.
 */
function escapeTaskText(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

/**
 * Displays an error below a required field.
 * @param {HTMLFormElement} form - Add Task form.
 * @param {string} name - Field name.
 * @param {boolean} isInvalid - Whether the field is invalid.
 * @returns {boolean} The invalid state.
 */
function showTaskFieldError(form, name, isInvalid) {
  form.querySelector(`[data-error="${name}"]`).textContent =
    isInvalid ? "This field is required" : "";
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
  const data = new FormData(form);
  return {
    title: escapeTaskText(data.get("title").trim()),
    description: escapeTaskText(data.get("description").trim()),
    dueDate: data.get("dueDate"),
    category: data.get("category"), status: newTaskStatus,
    priority: selectedTaskPriority,
    assignedUsers: getSelectedUsers(form.elements.assignedUsers),
    assignedUserNames: getSelectedUserNames(form.elements.assignedUsers),
    subtasks: newTaskSubtasks.length ? { completed: 0, total: newTaskSubtasks.length } : undefined,
    subtaskTitles: [...newTaskSubtasks],
  };
}

/**
 * Updates an existing task from the form fields.
 * @param {HTMLFormElement} form - Edit Task form.
 * @returns {Promise<void>}
 */
async function submitEditedTask(form) {
  const taskIndex = exampleTasks.findIndex(({ id }) => id === editingTaskId);
  if (taskIndex < 0) return;
  const currentTask = exampleTasks[taskIndex];
  const updatedTask = {
    ...currentTask,
    ...createTaskFromForm(form),
    id: editingTaskId,
    status: currentTask.status,
  };
  updatedTask.fullDescription = updatedTask.description;
  exampleTasks[taskIndex] = updatedTask;
  await patchData(`tasks/${editingTaskId}`, {
    title: updatedTask.title,
    description: updatedTask.description,
    fullDescription: updatedTask.description,
    dueDate: updatedTask.dueDate,
    category: updatedTask.category,
    priority: updatedTask.priority,
    assignedUsers: updatedTask.assignedUsers,
    assignedUserNames: updatedTask.assignedUserNames,
    subtasks: updatedTask.subtasks,
    subtaskTitles: updatedTask.subtaskTitles,
  });
  closeAddTask();
  renderSearchResults(document.getElementById("task-search").value);
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
  if (editingTaskId) {
    await submitEditedTask(form);
    return;
  }
  const task = createTaskFromForm(form);
  const { name: firebaseId } = await postData("tasks", task);
  task.id = firebaseId;
  console.log("Neuer Task angelegt:", task);
  exampleTasks.push(task);
  closeAddTask();
  renderSearchResults(document.getElementById("task-search").value);
}

/**
 * Handles all Add Task dialog clicks.
 * @param {MouseEvent} event - Document click event.
 * @returns {void}
 */
function handleAddTaskClick(event) {
  const opener = event.target.closest("[data-add-task-status]");
  if (opener) openAddTask(opener.dataset.addTaskStatus);
  if (event.target.closest(".add-task-close")) closeAddTask();
  if (event.target.id === "add-task-overlay") closeAddTask();
  const priorityButton = event.target.closest("[data-priority]");
  if (priorityButton) selectTaskPriority(priorityButton);
}

/**
 * Handles form and subtask events inside the Add Task dialog.
 * @param {Event} event - Bubbling form event.
 * @returns {void}
 */
function handleAddTaskFormEvent(event) {
  if (event.type === "submit" && event.target.id === "add-task-form") submitNewTask(event);
  if (event.type === "keydown" && event.target.name === "subtask") addSubtaskOnEnter(event);
}

document.addEventListener("click", handleAddTaskClick);
document.addEventListener("submit", handleAddTaskFormEvent);
document.addEventListener("keydown", handleAddTaskFormEvent);

async function initTaskContent() {
  await loadAddTaskContent();
}

async function loadAddTaskContent() {
  const CONTAINER_ADD_TASK = document.getElementById("addTaskContent");

  CONTAINER_ADD_TASK.innerHTML = addTaskContentTemplate;
  await renderAssignedContacts();

}
