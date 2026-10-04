let openedTaskId = "";

/**
 * Creates the assigned-user rows for a task overlay.
 * @param {Object} task - Task containing assigned users.
 * @returns {string} Assigned-user HTML.
 */
function getOverlayUsersHtml(task) {
  const users = task.assignedUsers || [];
  return users.map((initials, index) =>
    fillTemplate(taskOverlayUserTemplate, {
      initials,
      name: task.assignedUserNames?.[index] || initials,
    }),
  ).join("");
}

/**
 * Creates the completed subtask rows for a task overlay.
 * @param {string[]|undefined} subtaskTitles - Names of the subtasks.
 * @returns {string} Subtask HTML.
 */
function getOverlaySubtasksHtml(task) {
  const titles = task.subtaskTitles || [];
  const done = task.subtaskDone || [];
  return titles.map((title, index) =>
    fillTemplate(taskOverlaySubtaskTemplate, {
      id: index,
      title,
      checked: done[index] ? "checked" : "",
    }),
  ).join("");
}

/**
 * Toggles the done state of a subtask in the opened task and updates the completed counter.
 * @param {number} index - Index of the subtask to toggle.
 */

function toggleSubtask(index) {
  const task = exampleTasks.find(({id})=> id === openedTaskId);
  if (!task) return;
  task.subtaskDone[index] = !task.subtaskDone[index];
  task.subtasks.completed = task.subtaskDone.filter(Boolean).length;
  //false = offen, true = erledigt
}

/**
 * Returns the priority icon matching a task.
 * @param {string} priority - Task priority.
 * @returns {string} Priority icon HTML.
 */
function getOverlayPriorityIcon(priority) {
  if (priority === "urgent") return urgentPriorityTemplate;
  if (priority === "medium") return mediumPriorityTemplate;
  return lowPriorityTemplate;
}

/**
 * Creates the complete HTML for a task overlay.
 * @param {Object} task - Task to display.
 * @returns {string} Task overlay HTML.
 */
function getTaskOverlayHtml(task) {
  const priority = task.priority;
  const subtasks = getOverlaySubtasksHtml(task);
  return fillTemplate(taskOverlayTemplate, {
    categoryClass: getCategoryClass(task.category), category: task.category,
    title: task.title, description: task.fullDescription || task.description,
    dueDate: task.dueDate || "No date", priorityLabel: capitalize(priority || "medium"),
    priorityIcon: getOverlayPriorityIcon(priority || "medium"),
    assignedUsers: getOverlayUsersHtml(task), subtasks,
    subtaskSectionClass: subtasks ? "" : "task-overlay-section-hidden",
  });
}

/**
 * Capitalizes the first letter of a text value.
 * @param {string} value - Text to capitalize.
 * @returns {string} Capitalized text.
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Opens the detail overlay for one task.
 * @param {string} taskId - ID of the selected task.
 * @returns {void}
 */
function openTaskOverlay(taskId) {
  const overlay = document.getElementById("task-overlay");
  const task = exampleTasks.find(({ id }) => id === taskId);
  if (!task) return;
  openedTaskId = taskId;
  overlay.innerHTML = getTaskOverlayHtml(task);
  setBadgeBackgroundColor();
  overlay.showModal();
  document.body.classList.add("overlay-open");
}

/**
 * Deletes the currently opened task and refreshes the board.
 * @returns {promise}
 */
async function deleteOpenedTask() {
  const taskIndex = exampleTasks.findIndex(({ id }) => id === openedTaskId);
  if (taskIndex < 0) return;
  exampleTasks.splice(taskIndex, 1);
  await deleteData("tasks/" + openedTaskId);
  closeTaskOverlay();
  renderSearchResults(document.getElementById("task-search").value);
}

/**
 * Opens the form for the currently displayed task.
 * @returns {void}
 */
function editOpenedTask() {
  const task = exampleTasks.find(({ id }) => id === openedTaskId);
  if (!task) return;
  closeTaskOverlay();
  openEditTask(task);
}

/**
 * Closes the task detail overlay.
 * @returns {void}
 */
function closeTaskOverlay() {
  document.getElementById("task-overlay").close();
  document.body.classList.remove("overlay-open");
}

/**
 * Handles clicks on cards and overlay closing areas.
 * @param {MouseEvent} event - Document click event.
 * @returns {void}
 */
function handleTaskOverlayClick(event) {
  const card = event.target.closest(".task-card");
  const backdrop = event.target.id === "task-overlay";
  if (card) openTaskOverlay(card.dataset.taskId);
  if (event.target.closest(".task-overlay-delete")) deleteOpenedTask();
  if (event.target.closest(".task-overlay-edit")) editOpenedTask();
  if (backdrop || event.target.closest(".task-overlay-close")) closeTaskOverlay();
}

/**
 * Handles changes on subtask checkboxes inside the overlay.
 * @param {Event} event - Document change event.
 * @returns {void}
 */
function handleSubtaskCheckboxChange(event) {
  if (event.target.classList.contains("subtask-checkbox")) {
    toggleSubtask(event.target);
  }
}

document.addEventListener("click", handleTaskOverlayClick);
document.getElementById('task-overlay').addEventListener('close', () => {
  document.body.classList.remove('overlay-open');
})
document.addEventListener("change", handleSubtaskCheckboxChange);