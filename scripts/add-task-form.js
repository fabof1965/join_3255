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

function removeSelectedClassFromPriorityButtons() {
  document.querySelectorAll("[data-priority]").forEach((priorityButton) => {
    priorityButton.classList.remove("selected");
  });
}

async function getAssignedContacts() {
  const response = await getData("contacts");

  if (!response) return [];

  return Object.entries(response).map(([id, contact]) => ({
    id,
    ...contact,
  }));
}

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
}

function renderNewSubtasks() {
  const list = document.querySelector(".add-task-subtasks");

  if (!list) return;

  list.innerHTML = newTaskSubtasks
    .map((title, index) => {
      return getAddTaskSubtaskTemplate(index, title);
    })
    .join("");
}

function addSubtaskFromInput(input) {
  const value = input.value.trim();

  if (!value) return false;

  newTaskSubtasks.push(value);
  input.value = "";
  renderNewSubtasks();

  return true;
}

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

  span.innerHTML = getEditSubtaskTemplate(newTaskSubtasks[index]);

  const handleButtons = item.querySelector(".subtask-button-container");

  handleButtons.style.opacity = 1;
  item.style.backgroundColor = "transparent";
  button.innerHTML = checkIconSvg;
  item.classList.add("is-editing");
  button.setAttribute("aria-label", "Save subtask");
  item.querySelector(".subtask-edit-input").focus();
}

function saveSubtaskOnEnter(event) {
  if (event.key !== "Enter") return;

  event.preventDefault();
  saveSubtask(event.target);
}

function saveSubtask(input) {
  const index = Number(input.closest(".subtask-list").dataset.index);
  const value = input.value.trim();

  if (value) {
    newTaskSubtasks[index] = value;
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
  const selectedPriorityText =
    document.querySelector(".selected").dataset.priority;
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
    selectedPriorityButton: document.querySelector(
      '[data-priority="' + priority + '"]',
    ),
    assignedContactsSelectElement: document.getElementById("assigned-contacts"),
    categorySelectElement: document.getElementById("taskCategorySelect"),
  };
}

function getSubtasksFromForm() {
  const subtasksElements = document.querySelectorAll(".subtask-wrapper");
  let subtasks = [];

  subtasksElements.forEach((subtaskElement) => {
    subtasks.push(subtaskElement.innerText);
  });

  subtasks = subtasks.map((subtaskTitle) => {
    return {
      title: subtaskTitle,
      done: false,
    };
  });

  return subtasks;
}

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

function directToBoard(boardURL) {
  if (window.location.pathname !== boardURL) {
    window.location.href = boardURL;
  }
}
