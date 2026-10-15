document.addEventListener("submit", handleAddTaskFormEvent);
document.addEventListener("keydown", handleAddTaskFormEvent);

async function initTaskContent() {
  await loadAddTaskContent();
}

async function loadAddTaskContent() {
  const CONTAINER_ADD_TASK = document.querySelector(".main-layout");

  CONTAINER_ADD_TASK.innerHTML += addTaskContentTemplate;
  await renderAssignedContacts(CONTAINER_ADD_TASK);
}