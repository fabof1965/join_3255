let newTaskStatus = "toDo";
let selectedTaskPriority = "medium";
let newTaskSubtasks = [];

/**
 * Opens the Add Task dialog for a board column.
 * @param {string} status - Initial board column status.
 * @returns {void}
 */
function openAddTask(status) {
  const overlay = document.getElementById("add-task-overlay");
  newTaskStatus = status;
  selectedTaskPriority = "medium";
  newTaskSubtasks = [];
  overlay.innerHTML = addTaskTemplate;
  overlay.hidden = false;
  document.body.classList.add("overlay-open");
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
    id: `task-${Date.now()}`, title: escapeTaskText(data.get("title").trim()),
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
 * Saves a new task locally and refreshes the board.
 * @param {SubmitEvent} event - Add Task form submit event.
 * @returns {void}
 */
async function submitNewTask(event) {
  event.preventDefault();
  const form = event.target;
  if (!isAddTaskFormValid(form)) return;
  let task = createTaskFromForm(form);
  let response = await postData("tasks", task);
  task.id = response.name;
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
  if (event.target.matches("[data-priority]")) selectTaskPriority(event.target);
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
