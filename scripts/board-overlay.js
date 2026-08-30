let openedTaskId = "";


/**
 * Creates the assigned-user rows for a task overlay.
 * @param {Object} task - Task containing assigned users.
 * @returns {string} Assigned-user HTML.
 */
function getOverlayUsersHtml(task) {
  return task.assignedUsers.map((initials, index) =>
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
function getOverlaySubtasksHtml(subtaskTitles = []) {
  return subtaskTitles.map((title) =>
    fillTemplate(taskOverlaySubtaskTemplate, { title }),
  ).join("");
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
  const subtasks = getOverlaySubtasksHtml(task.subtaskTitles);
  return fillTemplate(taskOverlayTemplate, {
    categoryClass: getCategoryClass(task.category), category: task.category,
    title: task.title, description: task.fullDescription || task.description,
    dueDate: task.dueDate || "No date", priorityLabel: capitalize(task.priority),
    priorityIcon: getOverlayPriorityIcon(task.priority),
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
  overlay.hidden = false;
  document.body.classList.add("overlay-open");
}


/**
 * Deletes the currently opened task and refreshes the board.
 * @returns {void}
 */
function deleteOpenedTask() {
  const taskIndex = exampleTasks.findIndex(({ id }) => id === openedTaskId);
  if (taskIndex < 0) return;
  exampleTasks.splice(taskIndex, 1);
  closeTaskOverlay();
  renderSearchResults(document.getElementById("task-search").value);
}


/**
 * Closes the task detail overlay.
 * @returns {void}
 */
function closeTaskOverlay() {
  document.getElementById("task-overlay").hidden = true;
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
  if (backdrop || event.target.closest(".task-overlay-close")) closeTaskOverlay();
}


document.addEventListener("click", handleTaskOverlayClick);
