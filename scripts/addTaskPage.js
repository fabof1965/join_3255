const taskPageForm = document.getElementById("task-page-form");
let taskPageContacts = [];
let taskPageSelected = new Set();
let taskPageSubtasks = [];
let taskPagePriority = "medium";
let taskPageSaving = false;


/** Initializes the page and its shared navigation. */
function initTaskPage() {
  const link = document.querySelector('#sidebar a[href=""]');
  if (link) link.href = "./add_task.html";
  markActiveSidebarLink();
  taskPageForm.addEventListener("submit", saveTaskPage);
  taskPageForm.addEventListener("reset", resetTaskPage);
  taskPageForm.addEventListener("input", updateTaskPageHint);
  document.addEventListener("click", handleTaskPageClick);
  document.addEventListener("keydown", handleTaskPageKey);
  document.getElementById("contact-search").addEventListener("input", renderTaskContacts);
  loadTaskPageContacts();
}


/** Loads available contacts without changing stored data. */
async function loadTaskPageContacts() {
  const list = document.getElementById("contact-list");
  list.textContent = "Loading contacts...";
  try {
    const contacts = await getData("contacts");
    if (contacts?.error) throw new Error(contacts.error);
    taskPageContacts = Object.entries(contacts || {}).map(normalizeTaskContact);
    taskPageContacts = taskPageContacts.filter((contact) => contact.name);
    taskPageContacts.sort((a, b) => a.name.localeCompare(b.name));
    renderTaskContacts();
  } catch {
    list.textContent = "Contacts could not be loaded. Reload the page to retry.";
  }
}


/** Converts a Firebase contact entry to the page format.
 * @param {Array} entry - Firebase key and contact data.
 * @returns {Object} Contact with name and initials.
 */
function normalizeTaskContact([id, contact]) {
  const first = contact?.["first-name"] || contact?.firstName || "";
  const last = contact?.["last-name"] || contact?.lastName || "";
  const name = String(contact?.name || `${first} ${last}`).trim();
  const initials = name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
  return { id, name, initials };
}


/** Renders the filtered list with safe text nodes. */
function renderTaskContacts() {
  const list = document.getElementById("contact-list");
  const query = document.getElementById("contact-search").value.toLowerCase().trim();
  const contacts = taskPageContacts.filter((contact) => contact.name.toLowerCase().includes(query));
  list.replaceChildren(...contacts.map(createTaskContactOption));
  if (!contacts.length) {
    const message = document.createElement("p");
    message.textContent = taskPageContacts.length ? "No contacts found" : "No contacts available";
    list.append(message);
  }
}


/** Builds a checkbox row.
 * @param {Object} contact - Contact to display.
 * @returns {HTMLLabelElement} Contact option.
 */
function createTaskContactOption(contact) {
  const label = document.createElement("label");
  const name = document.createElement("span");
  const checkbox = document.createElement("input");
  label.className = "contact-option";
  name.className = "contact-name";
  name.textContent = contact.name;
  checkbox.type = "checkbox";
  checkbox.checked = taskPageSelected.has(contact.id);
  checkbox.addEventListener("change", () => toggleTaskContact(contact.id, checkbox.checked));
  label.append(createTaskBadge(contact), name, checkbox);
  return label;
}


/** Creates a contact badge.
 * @param {Object} contact - Contact to display.
 * @returns {HTMLSpanElement} Initials badge.
 */
function createTaskBadge(contact) {
  const badge = document.createElement("span");
  badge.className = "contact-badge";
  badge.textContent = contact.initials;
  badge.title = contact.name;
  badge.setAttribute("aria-label", contact.name);
  return badge;
}


/** Updates selection and the visible badges.
 * @param {string} id - Contact key.
 * @param {boolean} checked - Selected state.
 */
function toggleTaskContact(id, checked) {
  if (checked) taskPageSelected.add(id);
  else taskPageSelected.delete(id);
  const selected = taskPageContacts.filter((contact) => taskPageSelected.has(contact.id));
  document.getElementById("selected-contacts").replaceChildren(...selected.map(createTaskBadge));
}


/** Shows or hides the contact picker.
 * @param {boolean} open - Requested state.
 */
function setTaskContactsOpen(open) {
  document.getElementById("contact-options").hidden = !open;
  document.getElementById("assignee-toggle").setAttribute("aria-expanded", String(open));
  if (open) document.getElementById("contact-search").focus();
}


/** Handles priority and contact picker clicks.
 * @param {MouseEvent} event - Document click.
 */
function handleTaskPageClick(event) {
  const priority = event.target.closest("[data-priority]");
  if (priority && !taskPageSaving) setTaskPagePriority(priority.dataset.priority);
  if (event.target.closest("#assignee-toggle")) {
    setTaskContactsOpen(document.getElementById("contact-options").hidden);
  } else if (!event.target.closest(".task-assignees")) setTaskContactsOpen(false);
  if (event.target.closest("#add-subtask")) addTaskPageSubtask();
}


/** Prevents subtask Enter from submitting the task and closes the picker.
 * @param {KeyboardEvent} event - Keyboard event.
 */
function handleTaskPageKey(event) {
  if (event.key === "Escape") setTaskContactsOpen(false);
  if (event.key !== "Enter") return;
  if (event.target.id === "task-subtask" || event.target.closest("#subtask-list")) {
    event.preventDefault();
    if (event.target.id === "task-subtask") addTaskPageSubtask();
  }
  if (event.target.id === "contact-search") event.preventDefault();
}


/** Updates the selected priority.
 * @param {string} priority - Priority value.
 */
function setTaskPagePriority(priority) {
  taskPagePriority = priority;
  document.querySelectorAll("[data-priority]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.priority === priority));
  });
}


/** Adds the pending subtask. */
function addTaskPageSubtask() {
  const input = document.getElementById("task-subtask");
  if (!input.value.trim() || taskPageSaving) return;
  taskPageSubtasks.push(input.value.trim());
  input.value = "";
  renderTaskPageSubtasks();
  input.focus();
}


/** Renders editable subtasks and delete controls. */
function renderTaskPageSubtasks() {
  const list = document.getElementById("subtask-list");
  list.replaceChildren(...taskPageSubtasks.map(createTaskSubtaskRow));
}


/** Builds one editable subtask row.
 * @param {string} title - Subtask text.
 * @param {number} index - Subtask index.
 * @returns {HTMLLIElement} Editable row.
 */
function createTaskSubtaskRow(title, index) {
  const row = document.createElement("li");
  const input = document.createElement("input");
  row.className = "subtask-row";
  input.value = title;
  input.setAttribute("aria-label", `Subtask ${index + 1}`);
  input.addEventListener("input", () => { taskPageSubtasks[index] = input.value; });
  row.append(input, createSubtaskDeleteButton(index));
  return row;
}


/** Creates an accessible delete button.
 * @param {number} index - Subtask index.
 * @returns {HTMLButtonElement} Delete button.
 */
function createSubtaskDeleteButton(index) {
  const button = document.createElement("button");
  const icon = document.createElement("img");
  button.type = "button";
  button.title = "Delete subtask";
  button.setAttribute("aria-label", `Delete subtask ${index + 1}`);
  icon.src = "../assets/icons/delete.svg";
  icon.alt = "";
  button.append(icon);
  button.addEventListener("click", () => {
    taskPageSubtasks.splice(index, 1);
    renderTaskPageSubtasks();
  });
  return button;
}


/** Updates a required-field hint while typing.
 * @param {Event} event - Input event.
 */
function updateTaskPageHint(event) {
  const name = event.target.name;
  if (!["title", "dueDate", "category"].includes(name)) return;
  const hint = document.getElementById(`${name}-error`);
  if (event.target.value.trim()) {
    hint.hidden = true;
    event.target.removeAttribute("aria-invalid");
  }
}


/** Validates a field and displays its error.
 * @param {string} name - Form field name.
 * @returns {boolean} Whether the field is valid.
 */
function validateTaskPageField(name) {
  const field = taskPageForm.elements[name];
  const valid = Boolean(field.value.trim()) && (name !== "dueDate" || field.validity.valid);
  const hint = document.getElementById(`${name}-error`);
  hint.textContent = name === "dueDate" && field.value ? "Please enter a valid date" : "This field is required";
  hint.classList.toggle("invalid", !valid);
  hint.hidden = valid;
  field.setAttribute("aria-invalid", String(!valid));
  return valid;
}


/** Returns a task compatible with the existing board.
 * @returns {Object} Firebase task payload.
 */
function getTaskPagePayload() {
  const fields = taskPageForm.elements;
  const contacts = taskPageContacts.filter((contact) => taskPageSelected.has(contact.id));
  const titles = taskPageSubtasks.map((title) => title.trim()).filter(Boolean);
  return {
    title: escapeTaskPageText(fields.title.value.trim()),
    description: escapeTaskPageText(fields.description.value.trim()),
    dueDate: fields.dueDate.value, category: fields.category.value, status: "toDo",
    priority: taskPagePriority, assignedUsers: contacts.map((contact) => contact.initials),
    assignedUserNames: contacts.map((contact) => escapeTaskPageText(contact.name)),
    subtaskTitles: titles.map(escapeTaskPageText),
    ...(titles.length ? { subtasks: { completed: 0, total: titles.length } } : {}),
  };
}


/** Escapes text for the existing board's HTML templates.
 * @param {string} value - Plain text.
 * @returns {string} Escaped text.
 */
function escapeTaskPageText(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}


/** Validates and starts saving once.
 * @param {SubmitEvent} event - Form submit event.
 */
async function saveTaskPage(event) {
  event.preventDefault();
  if (taskPageSaving) return;
  const valid = ["title", "dueDate", "category"].map(validateTaskPageField).every(Boolean);
  if (!valid) return taskPageForm.querySelector('[aria-invalid="true"]').focus();
  addTaskPageSubtask();
  setTaskPageBusy(true);
  await persistTaskPage();
}


/** Saves to Firebase and reports failures without losing the form. */
async function persistTaskPage() {
  try {
    const response = await postData("tasks", getTaskPagePayload());
    if (!response?.name) throw new Error("Save failed");
    showTaskPageFeedback("Task added to board", false);
    window.location.assign("./board.html");
  } catch {
    showTaskPageFeedback("Task could not be saved. Please try again.", true);
    setTaskPageBusy(false);
  }
}


/** Locks the form while saving.
 * @param {boolean} busy - Save state.
 */
function setTaskPageBusy(busy) {
  taskPageSaving = busy;
  taskPageForm.setAttribute("aria-busy", String(busy));
  taskPageForm.querySelectorAll("button, input, textarea, select").forEach((field) => {
    field.disabled = busy;
  });
  if (busy) showTaskPageFeedback("Creating task...", false);
}


/** Shows save feedback.
 * @param {string} text - Message.
 * @param {boolean} error - Whether saving failed.
 */
function showTaskPageFeedback(text, error) {
  const feedback = document.getElementById("task-feedback");
  feedback.textContent = text;
  feedback.classList.toggle("error", error);
}


/** Clears the form state and restores Figma's default hints. */
function resetTaskPage() {
  taskPageSelected.clear();
  taskPageSubtasks = [];
  setTaskPagePriority("medium");
  setTaskContactsOpen(false);
  document.getElementById("selected-contacts").replaceChildren();
  renderTaskPageSubtasks();
  showTaskPageFeedback("", false);
  taskPageForm.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
  ["title", "dueDate", "category"].forEach(resetTaskPageHint);
  setTimeout(renderTaskContacts, 0);
}


/** Restores one field hint.
 * @param {string} name - Required field name.
 */
function resetTaskPageHint(name) {
  const hint = document.getElementById(`${name}-error`);
  hint.textContent = "This field is required";
  hint.classList.remove("invalid");
  hint.hidden = name === "category";
}


initTaskPage();
