const exampleTasks = [
  {
    id: "task-1",
    category: "User Story",
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation...",
    status: "inProgress",
    assignedUsers: ["CE", "JB"],
    priority: "low",
    subtasks: { completed: 1, total: 2 },
  },
  {
    id: "task-2",
    category: "Technical Task",
    title: "HTML Base Template Creation",
    description: "Create reusable HTML base templates...",
    status: "awaitFeedback",
    assignedUsers: ["CE"],
    priority: "low",
    subtasks: { completed: 2, total: 3 },
  },
  {
    id: "task-3",
    category: "Technical Task",
    title: "CSS Architecture Planning",
    description: "Define CSS naming conventions and structure...",
    fullDescription: "Define CSS naming conventions and structure.",
    status: "done",
    assignedUsers: ["SG", "JB"],
    assignedUserNames: ["Saeed Ghorbani", "Jan-Simon Boecker"],
    priority: "urgent",
    dueDate: "02/09/2023",
    subtasks: { completed: 2, total: 2 },
    subtaskTitles: ["Establish CSS Methodology", "Setup Base Styles"],
  },
  {
    id: "task-4",
    category: "User Story",
    title: "Daily Kochwelt Recipe",
    description: "Implement daily recipe and portion calculator....",
    status: "awaitFeedback",
    assignedUsers: ["CE", "JB", "FG"],
    priority: "medium",
  },
];

let draggedTaskId = "";


/**
 * Replaces every placeholder in an HTML template.
 * @param {string} template - HTML containing named placeholders.
 * @param {Object.<string, string|number>} values - Values for the placeholders.
 * @returns {string} Completed HTML.
 */
function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
    template,
  );
}


/**
 * Creates the CSS class belonging to a task category.
 * @param {string} category - Visible category name.
 * @returns {string} Category CSS class.
 */
function getCategoryClass(category) {
  return category === "Technical Task"
    ? "task-category-technical"
    : "task-category-user-story";
}


/**
 * Creates the HTML for the assigned user badges.
 * @param {string[]} assignedUsers - Initials of assigned users.
 * @returns {string} User badge HTML.
 */
function getAssignedUsersHtml(assignedUsers) {
  return assignedUsers
    .map((initials) => fillTemplate(userBadgeTemplate, { initials }))
    .join("");
}


/**
 * Creates the HTML for a task's subtask progress.
 * @param {{completed: number, total: number}|undefined} subtasks - Subtask counts.
 * @returns {string} Progress HTML.
 */
function getSubtaskProgressHtml(subtasks) {
  if (!subtasks) return "";
  const progress = (subtasks.completed / subtasks.total) * 100;
  return fillTemplate(subtaskProgressTemplate, {
    completed: subtasks.completed,
    total: subtasks.total,
    progress,
  });
}


/**
 * Returns the symbol belonging to a task priority.
 * @param {string} priority - Task priority.
 * @returns {string} Visible priority symbol.
 */
function getPrioritySymbol(priority) {
  if (priority === "urgent") return "↑";
  return priority === "medium" ? "=" : "↓";
}


/**
 * Creates the HTML for one task card.
 * @param {Object} task - Task data displayed on the card.
 * @returns {string} Task card HTML.
 */
function getTaskCardHtml(task) {
  return fillTemplate(taskCardTemplate, {
    id: task.id,
    categoryClass: getCategoryClass(task.category), category: task.category,
    title: task.title, description: task.description,
    subtaskProgress: getSubtaskProgressHtml(task.subtasks),
    assignedUsers: getAssignedUsersHtml(task.assignedUsers),
    priority: task.priority, prioritySymbol: getPrioritySymbol(task.priority),
  });
}


/**
 * Renders one task in its matching board column.
 * @param {Object} task - Task to render.
 * @returns {void}
 */
function renderTask(task) {
  const taskList = document.querySelector(`[data-status="${task.status}"]`);

  if (!taskList) return;
  taskList.innerHTML += getTaskCardHtml(task);
}


/**
 * Renders every task and updates empty board columns.
 * @param {Object[]} tasks - Tasks to render.
 * @returns {void}
 */
function renderBoard(tasks) {
  const taskLists = document.querySelectorAll(".task-list");

  taskLists.forEach((taskList) => (taskList.innerHTML = ""));
  tasks.forEach(renderTask);
  renderEmptyTaskLists(taskLists);
  initializeDraggableCards();
}


/**
 * Adds a message to every board column without tasks.
 * @param {NodeListOf<HTMLElement>} taskLists - Board column containers.
 * @returns {void}
 */
function renderEmptyTaskLists(taskLists) {
  taskLists.forEach((taskList) => {
    if (taskList.children.length) return;
    taskList.innerHTML = fillTemplate(emptyTaskListTemplate, {
      text: taskList.dataset.emptyText,
    });
  });
}


/**
 * Finds tasks whose title or description contains the search term.
 * @param {string} searchTerm - Text entered in the search field.
 * @returns {Object[]} Matching tasks.
 */
function filterTasks(searchTerm) {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  return exampleTasks.filter((task) =>
    `${task.title} ${task.description}`.toLowerCase().includes(normalizedTerm),
  );
}


/**
 * Shows or hides the message for a search without matches.
 * @param {boolean} shouldShow - Whether the message should be visible.
 * @returns {void}
 */
function toggleNoResultsMessage(shouldShow) {
  const message = document.getElementById("search-no-results");
  const boardColumns = document.querySelector(".board-columns");
  message.hidden = !shouldShow;
  boardColumns.hidden = shouldShow;
}


/**
 * Renders tasks matching the current search input.
 * @param {InputEvent} event - Search field input event.
 * @returns {void}
 */
function searchTasks(event) {
  const searchTerm = event.target.value;
  renderSearchResults(searchTerm);
}


/**
 * Updates the board and message for a search term.
 * @param {string} searchTerm - Current search text.
 * @returns {void}
 */
function renderSearchResults(searchTerm) {
  const filteredTasks = filterTasks(searchTerm);
  renderBoard(filteredTasks);
  toggleNoResultsMessage(searchTerm.trim() !== "" && !filteredTasks.length);
}


/**
 * Activates the live board search.
 * @returns {void}
 */
function initializeTaskSearch() {
  const searchInput = document.getElementById("task-search");
  searchInput.addEventListener("input", searchTasks);
}


/**
 * Stores the ID of the card that starts being dragged.
 * @param {DragEvent} event - Card drag event.
 * @returns {void}
 */
function startDragging(event) {
  draggedTaskId = event.currentTarget.dataset.taskId;
  event.dataTransfer.setData("text/plain", draggedTaskId);
  event.currentTarget.classList.add("task-card-dragging");
}


/**
 * Removes the visual dragging state from a card.
 * @param {DragEvent} event - Card drag event.
 * @returns {void}
 */
function stopDragging(event) {
  event.currentTarget.classList.remove("task-card-dragging");
  clearDropPosition();
}


/**
 * Allows a task to be dropped into a board column.
 * @param {DragEvent} event - Column drag event.
 * @returns {void}
 */
function allowTaskDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.add("task-list-dragover");
  showDropPosition(event.currentTarget, event.clientY);
}


/**
 * Finds the first card below the current pointer position.
 * @param {HTMLElement} taskList - Current drop zone.
 * @param {number} pointerY - Vertical pointer position.
 * @returns {HTMLElement|undefined} Card to insert before.
 */
function getDropTarget(taskList, pointerY) {
  const cards = [...taskList.querySelectorAll(".task-card:not(.task-card-dragging)")];
  return cards.find((card) => {
    const bounds = card.getBoundingClientRect();
    return pointerY < bounds.top + bounds.height / 2;
  });
}


/**
 * Displays the calculated insertion position in a drop zone.
 * @param {HTMLElement} taskList - Current drop zone.
 * @param {number} pointerY - Vertical pointer position.
 * @returns {void}
 */
function showDropPosition(taskList, pointerY) {
  clearDropPosition();
  const target = getDropTarget(taskList, pointerY);
  taskList.classList.toggle("task-list-drop-end", !target);
  target?.classList.add("task-card-drop-before");
}


/**
 * Removes all visible insertion indicators.
 * @returns {void}
 */
function clearDropPosition() {
  document.querySelectorAll(".task-card-drop-before").forEach((card) =>
    card.classList.remove("task-card-drop-before"),
  );
  document.querySelectorAll(".task-list-drop-end").forEach((list) =>
    list.classList.remove("task-list-drop-end"),
  );
  document.querySelectorAll(".task-list-dragover").forEach((list) =>
    list.classList.remove("task-list-dragover"),
  );
}


/**
 * Removes the visual drop target state from a column.
 * @param {DragEvent} event - Column drag event.
 * @returns {void}
 */
function leaveTaskDropZone(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  event.currentTarget.classList.remove("task-list-dragover");
  clearDropPosition();
}


/**
 * Moves a task before another task or to the category end.
 * @param {Object} task - Dragged task.
 * @param {string} status - Destination category.
 * @param {string|undefined} targetId - Following task ID.
 * @returns {void}
 */
function moveTaskToPosition(task, status, targetId) {
  exampleTasks.splice(exampleTasks.indexOf(task), 1);
  task.status = status;
  const targetIndex = exampleTasks.findIndex(({ id }) => id === targetId);
  const insertAt = targetIndex < 0 ? exampleTasks.length : targetIndex;
  exampleTasks.splice(insertAt, 0, task);
}


/**
 * Moves the dragged task into the selected board column.
 * @param {DragEvent} event - Column drop event.
 * @returns {void}
 */
function dropTask(event) {
  event.preventDefault();
  const task = exampleTasks.find(({ id }) => id === draggedTaskId);
  const target = getDropTarget(event.currentTarget, event.clientY);
  if (task) moveTaskToPosition(task, event.currentTarget.dataset.status, target?.dataset.taskId);
  leaveTaskDropZone(event);
  renderSearchResults(document.getElementById("task-search").value);
}


/**
 * Adds drag events to all rendered task cards.
 * @returns {void}
 */
function initializeDraggableCards() {
  document.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("dragstart", startDragging);
    card.addEventListener("dragend", stopDragging);
  });
}


/**
 * Adds drop events to every board column.
 * @returns {void}
 */
function initializeTaskDropZones() {
  document.querySelectorAll(".task-list").forEach((taskList) => {
    taskList.addEventListener("dragover", allowTaskDrop);
    taskList.addEventListener("dragleave", leaveTaskDropZone);
    taskList.addEventListener("drop", dropTask);
  });
}


renderBoard(exampleTasks);
initializeTaskSearch();
initializeTaskDropZones();
