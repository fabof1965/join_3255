async function initTaskContent() {
  await loadAddTaskContent();
}

async function loadAddTaskContent() {
  const CONTAINER_ADD_TASK = document.querySelector(".main-layout");
  CONTAINER_ADD_TASK.innerHTML += addTaskContentTemplate;
  await renderAssignedContacts(CONTAINER_ADD_TASK);
  setTaskFormPriority(CONTAINER_ADD_TASK.querySelector("#add-task-form"), selectedTaskPriority);
}
