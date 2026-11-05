let selectedTaskPriority = "medium";
let editingTaskId = "";
let newTaskStatus = "toDo";
let newTaskSubtasks = [];
const allTasks = [];

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.endsWith("/pages/addTask.html")) {
    const addTaskForm = document.getElementById("add-task-form");
    await renderAssignedContacts(addTaskForm);
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id !== "add-task-form" || event.target.closest("dialog")) {
    return;
  }
  event.preventDefault();
  const saved = await submitTask(event, null);
  if (!saved) return;
  showSuccessPopup("Task successfully created");
  setTimeout(() => {
    directToBoard("../pages/board.html");
  }, 1500);
});

initPriorityButtonClickListeners();

/**
 * Adds a click listener to every priority button.
 * A click removes the "selected" class from all priority buttons and sets it on the clicked one.
 */
function initPriorityButtonClickListeners() {
  document.querySelectorAll(".priority-btn").forEach((priorityButton) => {
    priorityButton.addEventListener("click", () => {
      removeSelectedClassFromPriorityButtons();
      priorityButton.classList.add("selected");
    });
  });
}

const btnCleartaskForm = document.getElementById("btn-clear-task-form");
if (btnCleartaskForm) {
  btnCleartaskForm.addEventListener("click", () => resetForm());
}

/**
 * Removes the "selected" class from all priority buttons.
 */
function removeSelectedClassFromPriorityButtons() {
  document.querySelectorAll("[data-priority]").forEach((priorityButton) => {
    priorityButton.classList.remove("selected");
  });
}

/**
 * Loads all contacts from Firebase and adds the database id to each one.
 * @returns {Promise<Array<{id: string, email: string, phone: string}>>}
 * Array of contact objects, or an empty array if no contacts exist.
 */
async function getAssignedContacts() {
  const response = await getData("contacts");
  if (!response) return [];
  return Object.entries(response).map(([id, contact]) => ({
    id,
    ...contact,
  }));
}

/**
 * Renders the assigned contacts as options into the hidden select.
 * @param {HTMLElement} container - Form element containing the `#assigned-contacts` select.
 */
async function renderAssignedContacts(container) {
  const assignedContacts = await getAssignedContacts();
  sortContactsByName(assignedContacts);
  const contactRef = container.querySelector("#assigned-contacts");
  contactRef.innerHTML = assignedContacts
    .map((contact) => {
      return getAssignedContactOptionTemplate(
        getInitials(contact.name),
        contact.name,
      );
    })
    .join("");
  renderAssignedContactsDropdown(container);
}

/**
 * Renders the list of new subtasks.
 */
function renderNewSubtasks() {
  const list = document.querySelector(".add-task-subtasks");
  if (!list) return;
  list.innerHTML = newTaskSubtasks
    .map((subtask, index) => {
      return getAddTaskSubtaskTemplate(index, subtask.title);
    })
    .join("");

  addButtonEventListenersOnSubtask();
}

function addButtonEventListenersOnSubtask() {
  let subtaskIndex = 0;
  newTaskSubtasks.forEach((subtask) => {
    const editButton = document.querySelector('[data-edit-index="' + subtaskIndex + '"]');
    const deleteButton = document.querySelector('[data-delete-index="' + subtaskIndex + '"]');
    editButton.addEventListener("click", () => editSubtask(editButton));
    deleteButton.addEventListener("click", () => deleteSubtask(deleteButton));
    subtaskIndex++;
  });
}

/**
 * Adds a input value as a new subtask and renders the subtask-list.
 * @param {HTMLInputElement} input - Input field containing the subtask title.
 * @returns {boolean} `true` if a subtask was added, `false` if the input was empty.
 */
function addSubtaskFromInput(input) {
  const value = input.value.trim();
  if (!value) return false;
  newTaskSubtasks.push({
    title: value,
    done: false,
  });
  input.value = "";
  renderNewSubtasks();
  return true;
}

/**
 * Adds a subtask when the enter key is pressed.
 * @param {KeyboardEvent} event - Keydown event from the subtask input field
 */
function addSubtaskOnEnter(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addSubtaskFromInput(event.target);
}

document.addEventListener("keydown", (event) => {
  if (event.target.name === "subtask") {
    addSubtaskOnEnter(event);
  }
  if (event.target.name === "subtask-edit") {
    saveSubtaskOnEnter(event);
  }
});

/**
 * Removes subtask when the trash icon is clicked.
 * @param {HTMLElement} button - The delete button inside the subtask list item that was clicked.
 */
async function deleteSubtask(button) {
  const index = Number(button.closest(".subtask-list").dataset.index);
  newTaskSubtasks.splice(index, 1);
  await deleteData("subtasks" + index);
  renderNewSubtasks();
}

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
 * Saves subtask when the enter key is pressed.
 * @param {KeyboardEvent} event - Keydown event from the subtask input field.
 */
function saveSubtaskOnEnter(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  saveSubtask(event.target);
}

/**
 * Saves a subtask in the subtask list and renders the list.
 * @param {HTMLElement} input - Input field containing the subtask title.  
 */
function saveSubtask(input) {
  const index = Number(input.closest(".subtask-list").dataset.index);
  const value = input.value.trim();
  if (value) {
    newTaskSubtasks[index].title = value;
  }
  renderNewSubtasks();
}

function resetForm(form = document.getElementById("add-task-form")) {
  if (!form) return;
  form.reset();
  form.querySelectorAll("[data-error]").forEach((error) => {
    error.textContent = "";
  });
  ["title", "dueDate", "category"].forEach((name) => {
    form.elements[name]?.setAttribute("aria-invalid", "false");
  });
  newTaskSubtasks = [];
  selectedTaskPriority = "medium";
  renderNewSubtasks();
}

function showTaskFieldError(form, name, isInvalid) {
  const field = form.elements[name];
  const error = form.querySelector(`[data-error="${name}"]`);
  if (error) {
    error.textContent = isInvalid ? "This field is required" : "";
  }
  if (field) {
    field.setAttribute("aria-invalid", String(isInvalid));
  }
  return isInvalid;
}

function isAddTaskFormValid(form) {
  const titleInvalid = !form.elements.title.value.trim();
  const dateInvalid = !form.elements.dueDate.value;
  const categoryInvalid = !form.elements.category.value;
  showTaskFieldError(form, "title", titleInvalid);
  showTaskFieldError(form, "dueDate", dateInvalid);
  showTaskFieldError(form, "category", categoryInvalid);
  return !titleInvalid && !dateInvalid && !categoryInvalid;
}

function getAssignedContactsFromForm() {
  const select = document.getElementById("assigned-contacts");
  const assignedContacts = [];
  const selectedContacts = select.selectedOptions;
  for (let i = 0; i < selectedContacts.length; i++) {
    assignedContacts.push(selectedContacts[i].innerText);
  }
  return assignedContacts;
}

function getTaskData() {
  const formElements = getFormElements();
  const assignedContactsArray = getAssignedContactsFromForm();
  const selectedPriorityText = document.querySelector(".selected").dataset.priority;
  const subtasks = getSubtasksFromForm();
  const taskData = {
    title: formElements.taskTitleInputElement.value.trim(),
    description: formElements.taskDescriptionElement.value.trim(),
    dueDate: formElements.dueDateElement.value,
    category: formElements.categorySelectElement.selectedOptions[0].innerText,
    status: newTaskStatus,
    assignedContacts: assignedContactsArray,
    priority: selectedPriorityText,
    subtasks: subtasks,
  };
  return taskData;
}

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
 * Returns a copy of the current subtasks from the form.
 * The data comes from the global variable `newTaskSubtasks`.
 * @returns {{title: string, done: boolean} []}
 */
function getSubtasksFromForm() {
  return newTaskSubtasks.map((subtask) => ({ ...subtask, }));
}

/**
 * Validates the data from the add-task form and saves it to Firebase
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
 * Redirects to the board page if it isn't already open.
 * @param {string} boardURL - Path to the board page.
 */
function directToBoard(boardURL) {
  if (window.location.pathname !== boardURL) {
    window.location.href = boardURL;
  }
}

/**
 * Displays a pop-up message when a task is created.
 * @param {string} message - “Task created” is shown in the pop-up.
 */
function showPopup(message = "Task created") {
  document.getElementById("popup")?.remove();
  document.body.insertAdjacentHTML("beforeend", getPopupTemplate());
  const popup = document.getElementById("popup");
  if (!popup) throw new Error("Could not create the success popup.");
  popup.querySelector("h2").textContent = message;
  popup.showModal();
  window.setTimeout(() => {
    if (popup.open) popup.close();
    popup.remove();
  }, 3000);
}

/**
 * Creates the visible checkbox dropdown.
 * The hidden select remains the data source for saving tasks.
 */
function renderAssignedContactsDropdown(container) {
  const select = container.querySelector("#assigned-contacts");
  const dropdown = container.querySelector(".assigned-dropdown");
  if (!select || !dropdown) return;
  const list = dropdown.querySelector(".assigned-dropdown-list");
  list.replaceChildren();
  const editedTask = allTasks.find((task) => task.id === editingTaskId);
  if (editedTask) {
    Array.from(select.options).forEach((option) => {
      option.selected = (editedTask.assignedContacts || []).includes(
        option.textContent,
      );
    });
  }
  Array.from(select.options).forEach((option) => {
    const row = document.createElement("label");
    row.className = "assigned-dropdown-option";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = option.selected;
    const name = document.createElement("span");
    name.textContent = option.textContent;
    checkbox.addEventListener("change", () => {
      option.selected = checkbox.checked;
      updateAssignedContactsSummary(dropdown, select);
    });
    checkbox.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      if (!event.repeat) {
        checkbox.click();
      }
    });
    row.append(checkbox, name);
    list.appendChild(row);
  });
  if (!select.options.length) {
    const empty = document.createElement("p");
    empty.className = "assigned-dropdown-empty";
    empty.textContent = "No contacts available";
    list.appendChild(empty);
  }
  updateAssignedContactsSummary(dropdown, select);
}

/**
 * Updates the display text in the drop-down menu for the assigned contacts.
 * @param {HTMLElement} dropdown - Dropdown container with the assigned contacts.
 * @param {HTMLSelectElement} select - Select element with the contact options.
 */
function updateAssignedContactsSummary(dropdown, select) {
  const names = Array.from(
    select.selectedOptions,
    (option) => option.textContent,
  );
  dropdown.querySelector(".assigned-dropdown-text").textContent = names.length ? names.join(", ") : "Select contacts to assign";
}

document.addEventListener("click", (event) => {
  document.querySelectorAll(".assigned-dropdown[open]").forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      dropdown.open = false;
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const dropdown = event.target.closest(".assigned-dropdown[open]");
  if (!dropdown) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  dropdown.open = false;
  dropdown.querySelector("summary").focus();
},
  true,
);

document.addEventListener("reset", (event) => {
  const form = event.target;
  if (!form.querySelector(".assigned-dropdown")) return;
  setTimeout(() => {
    const dropdown = form.querySelector(".assigned-dropdown");
    const select = form.querySelector("#assigned-contacts");
    if (!dropdown || !select) return;
    Array.from(select.options).forEach((option) => {
      option.selected = false;
    });
    dropdown.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
    dropdown.open = false;
    updateAssignedContactsSummary(dropdown, select);
  }, 0);
});