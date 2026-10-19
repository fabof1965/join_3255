// this is an example structure of a task
//{
//     id: "task-1",
//     category: "User Story",
//     title: "Kochwelt Page & Recipe Recommender",
//     description: "Build start page with recipe recommendation...",
//     fullDescription: "Build start page with recipe recommendation and a detailed description of the recipes.",
//     status: "inProgress",
//     assignedUsers: ["CE", "JB"],
//     assignedUserNames: ["Saeed Ghorbani", "Jan-Simon Boecker"],
//     dueDate: "02/09/2023",
//     priority: "low",
//     subtasks: { completed: 1, total: 2 },
//     subtaskTitles: ["Establish CSS Methodology", "Setup Base Styles"],
//     subtaskDone: [true, false],
//   }

const allTasks = [];

let draggedTaskId = "";

async function initBoardContent() {
  await loadTasks();
  renderBoardContent(allTasks);
  initializeTaskSearch();
  initializeTaskDropZones();
}

function renderTaskCards(tasks = allTasks) {
  for(let indexTask = 0; indexTask < tasks.length; indexTask++) {
    const task = tasks[indexTask];
    const taskStatus = task.status;
    const taskList = document.querySelector('div.task-list[data-status="' + taskStatus + '"]');
    if(taskList) taskList.innerHTML += getTaskCardHtml(task);
  }
}

function emptyTaskLists() {
  const taskLists = document.querySelectorAll(".task-list");
  taskLists.forEach((taskList) => (taskList.innerHTML = ""));
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
  if (!assignedUsers) return "";
  return assignedUsers
    .map((initials) => fillTemplate(userBadgeTemplate, { initials }))
    .join("");
}

/**
 * Creates the HTML for a task's subtask progress.
 * @param {{completed: number, total: number}|undefined} subtasks - Subtask counts.
 * @returns {string} Progress HTML.
 */
function getSubtaskDataProgressHtml(subtasks) {
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
  if (priority === "urgent") return urgentPriorityTemplate;
  return priority === "medium" ? mediumPriorityTemplate : lowPriorityTemplate;
}

/**
 * Creates the HTML for one task card.
 * @param {Object} task - Task data displayed on the card.
 * @returns {string} Task card HTML.
 */
function getTaskCardHtml(task) {
  if (!task) return "";
  return fillTemplate(taskCardTemplate, {
    id: task.id,
    categoryClass: getCategoryClass(task.category), category: task.category,
    title: task.title, description: task.description,
    subtaskProgress: getSubtaskDataProgressHtml(task.subtasks),
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

function openTask() {
  const dialog = document.getElementById('task-card-overlay');
  dialog.showModal();
}

/**
 * Renders every task and updates empty board columns.
 * @param {Object[]} tasks - Tasks to render.
 * @returns {void}
 */
function renderBoardContent(tasks) {
  emptyTaskLists();
  renderTaskCards(tasks);
  renderEmptyTaskLists();
  setBadgeBackgroundColor();
  initializeDraggableCards();
}

/**
 * Adds a message to every board column without tasks.
 * @param {NodeListOf<HTMLElement>} taskLists - Board column containers.
 * @returns {void}
 */
function renderEmptyTaskLists() {
  const taskLists = document.querySelectorAll(".task.list");
  taskLists.forEach((taskList) => {
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
  return allTasks.filter((task) => taskMatchesTerm(task, normalizedTerm));
}

function taskMatchesTerm(task, normalizedTerm) {
  const title = task.title.toLowerCase();
  const description = (task.description ?? "").toLowerCase();

  return title.includes(normalizedTerm) || description.includes(normalizedTerm);
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
  const filteredTasks = filterTasks(searchTerm);
  const showNoResults = isSearchActive(searchTerm) && filteredTasks.length === 0;

  renderSearchResults(filteredTasks, showNoResults);
}

function isSearchActive(searchTerm) {
  return searchTerm.trim() !== "";
}

function renderSearchResults(tasks, showNoResults) {
  emptyTaskLists();
  renderTaskCards(tasks);
  toggleNoResultsMessage(showNoResults);
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
  const grabbedTask = event.currentTarget;
  draggedTaskId = grabbedTask.dataset.taskId;
  event.dataTransfer.setData("text/plain", draggedTaskId);
  grabbedTask.classList.add("task-card-dragging");
}

/**
 * Removes the visual dragging state from a card.
 * @param {DragEvent} event - Card drag event.
 * @returns {void}
 */
function stopDragging(event) {
  const grabbedTask = event.currentTarget;
  grabbedTask.classList.remove("task-card-dragging");
}

/**
 * Allows a task to be dropped into a board column.
 * @param {DragEvent} event - Column drag event.
 * @returns {void}
 */
function dragTaskCardOverTaskList(event) {
  event.preventDefault();
  const taskList = event.currentTarget;
  taskList.classList.add("task-list-dragover");
}

/**
 * Removes all visible insertion indicators.
 * @returns {void}
 */
function clearDropPosition() {
  document.querySelectorAll(".task-list-dragover").forEach((taskList) =>
    taskList.classList.remove("task-list-dragover"),
  );
}

/**
 * Removes the visual drop target state from a column.
 * @param {DragEvent} event - Column drag event.
 * @returns {void}
 */
function leaveTaskCardDropZone(event) {
  const dragoverClass = "task-list-dragover";
  const taskList = event.currentTarget;

  taskList.classList.remove(dragoverClass);
}

/**
 * Moves a task before another task or to the category end.
 * @param {Object} task - Dragged task.
 * @param {string} status - Destination category.
 * @param {string|undefined} targetId - Following task ID.
 * @returns {void}
 */
function changeTaskStatus(task, status) {
  task.status = status;
}

/**
 * Moves the dragged task into the selected board column.
 * @param {DragEvent} event - Column drop event.
 * @returns {void}
 */
async function dropTaskIntoTaskList(event) {
  clearDropPosition();
  event.preventDefault();
  const taskList = event.currentTarget;
  const task = allTasks.find(({ id }) => id === draggedTaskId);
  changeTaskStatus(task, taskList.dataset.status);
  renderBoardContent();
  await patchData(`tasks/${task.id}`, { status: task.status });
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
    taskList.addEventListener("dragover", dragTaskCardOverTaskList);
    taskList.addEventListener("dragleave", leaveTaskCardDropZone);
    taskList.addEventListener("drop", dropTaskIntoTaskList);
  });
}

/**
 *
 * @param {Object.<string, Object>|null} tasksObject - Tasks-Objekt aus Firebase (Key = Firebase-ID).
 * @returns {Object[]} Array mit allen Tasks, jeder Task enthält zusätzlich seine id.
 */
function createAllTaskArrayFromData(allTaskData) {
  if (!allTaskData) return [];
  return Object.entries(allTaskData).map(([id, task]) => ({ ...task, id}));
}

async function loadTasks() {
  try {
    const allTaskData = await getData("tasks");
    const taskDataArray = createAllTaskArrayFromData(allTaskData);
    taskDataArray.forEach((task) => allTasks.push(task));
  } catch (error) {
    console.error("Fehler beim laden der Tasks", error);
    allTasks = [];
  }
}