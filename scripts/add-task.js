let newTaskCategory = "toDo";
let selectedTaskPriority = "medium";
let newTaskSubtasks = [];

function handleAddTaskFormEvent(event) {
  if (event.type === "submit" && event.target.id === "add-task-form") submitNewTask(event);
  if (event.type === "keydown" && event.target.name === "subtask") addSubtaskOnEnter(event);
  if (event.type === "keydown" && event.target.name === "subtask-edit") saveSubtaskOnEnter(event);
}

document.addEventListener("submit", handleAddTaskFormEvent);
document.addEventListener("keydown", handleAddTaskFormEvent);
document.addEventListener("click", (event) => {
  const priorityButton = event.target.closest("[data-priority]");
  if (priorityButton) selectTaskPriority(priorityButton);
  const deleteButton = event.target.closest('[data-action="delete"]');
  if (deleteButton) deleteSubtask(deleteButton);
  const editButton = event.target.closest('[data-action="edit"]');
  if (editButton) editSubtask(editButton);
});

async function initTaskContent() {
  await loadAddTaskContent();
}

async function loadAddTaskContent() {
  const CONTAINER_ADD_TASK = document.querySelector(".main-layout");
  CONTAINER_ADD_TASK.innerHTML += addTaskContentTemplate;
  await renderAssignedContacts(CONTAINER_ADD_TASK);
  setTaskFormPriority(CONTAINER_ADD_TASK.querySelector("#add-task-form"), selectedTaskPriority);
}
