const ALL_STATUSES = [
  { key: 'toDo', label: 'To do' },
  { key: 'inProgress', label: 'In progress' },
  { key: 'awaitFeedback', label: 'Await feedback' },
  { key: 'done', label: 'Done' }
];

document.addEventListener("DOMContentLoaded", initBoardContent);

/**
 * Initializes the content of the board page.
 * @returns {Promise<void>} Resolves once the board is fully initialized.
 */
async function initBoardContent() {
  await loadTasks();
  renderBoardContent(allTasks);
  initializeTaskSearch();
  initializeDragAndDrop();
  showPopupAfterRedirect();
}

/**
 * Shows and clears the task-created message saved before navigating to the board.
 */
function showPopupAfterRedirect() {
  if (sessionStorage.getItem("taskCreatedPopup") !== "true") return;
  sessionStorage.removeItem("taskCreatedPopup");
  showPopup();
}

/**
 * @description Displays all tasks as cards in the appropriate column on the board.
 * @param {Array<Object>} [tasks=allTasks] - List of tasks to be rendered.
 * @param {string} task[].status - Task status ("todo", "In progress", "Await feedback" and "Done").
 */
function renderTaskCards(tasks = allTasks) {
  for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
    const task = tasks[indexTask];
    const taskStatus = task.status;
    const taskList = document.querySelector('div.task-list[data-status="' + taskStatus + '"]');
    if (taskList) taskList.innerHTML += getTaskCardHtml(task);
  }
}

/**
 * Removes all rendered task cards from every task list on the board.
 */
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
  return category === "Technical Task" ? "task-category-technical" : "task-category-user-story";
}

/**
 * Creates the HTML for the assigned user badges.
 * @param {string[]} assignedUsers - Initials of assigned users.
 * @returns {string} User badge HTML.
 */
function getUserInitials(assignedUsers, maxShownUsers) {
  if (!assignedUsers) return "";
  let userBadgesHTML = "";
  for(let indexUserName = 0; indexUserName < assignedUsers.length; indexUserName++) {
    const assignedUserName = assignedUsers[indexUserName];
    if((indexUserName + 1) <= maxShownUsers)
      userBadgesHTML += getUserBadgeTemplate(getInitials(assignedUserName).toUpperCase());

    if((indexUserName + 1) === maxShownUsers) {
      const otherUserNumber = assignedUsers.length - (indexUserName + 1);
      if(otherUserNumber > 0)
        userBadgesHTML += getUserBadgeTemplate("+" + otherUserNumber);
      break;
    }
  }
  return userBadgesHTML;
}

/**
 * Creates the HTML for a task's subtask progress.
 * @param {{completed: number, total: number}|undefined} subtasks - Subtask counts.
 * @returns {string} Progress HTML.
 */
function getSubtaskDataProgressHtml(subtasks, id) {
  if (!subtasks) return getSubtaskProgressTemplate(0, 0, 0, id);
  const totalSubtasks = subtasks.length;
  const completedSubtasks = countCompletedSubtasks(subtasks);
  let progress = (completedSubtasks / totalSubtasks) * 100;
  if (isNaN(progress)) progress = 0;
  return getSubtaskProgressTemplate(completedSubtasks, progress, totalSubtasks, id);
}

/**
 * Counts the completed subtasks.
 * @param {Array<{done: boolean}>} subtasks - List of subtasks.
 * @returns {number} Number of completed subtasks.
 */
function countCompletedSubtasks(subtasks) {
  let completedSubtasks = 0;
  if (!subtasks) return completedSubtasks;
  subtasks.map((subtask) => {
    if (subtask.done === true) completedSubtasks++
    return completedSubtasks;
  });
  return completedSubtasks;
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
  return getTaskCardTemplate(task);
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
function renderBoardContent(tasks) {
  emptyTaskLists();
  if (tasks) renderTaskCards(tasks);
  renderEmptyTaskLists();
  setBadgeBackgroundColor();
  initializeDragEventsForTaskCards();
}

/**
 * Adds a message to every board column without tasks.
 * @param {NodeListOf<HTMLElement>} taskLists - Board column containers.
 * @returns {void}
 */
function renderEmptyTaskLists() {
  const taskLists = document.querySelectorAll(".task-list");
  taskLists.forEach((taskList) => {
    renderTaskListOnEmptyContent(taskList);
  });
}

/**
 * Renders a message for an empty task list.
 * @param {HTMLElement} taskList - The task list element that should display the empty message.
 */
function renderEmptyTaskListContent(taskList) {
  const emptyTaskListMessage = taskList.dataset.emptyText;
  taskList.innerHTML = getEmptyTaskListElement(emptyTaskListMessage);
}

/**
 * Checks whether a task list on the board is empty.
 * If a task list has no entries, a message saying “No tasks ...” appears.
 * @param {HTMLElement} taskList - The task list element that should display the empty message.
 */
function renderTaskListOnEmptyContent(taskList) {
  if (taskList.children.length === 0) {
    renderEmptyTaskListContent(taskList);
  }
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

/**
 * Checks whether a task's title or decription countains the search term.
 * @param {object} task - Task object with a title and an optional description.
 * @param {string} normalizedTerm - Trimmed, lowercase search term.
 * @returns {boolean} - True if the title or descritopn contains the term.
 */
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

/**
 * @description Checks whether the search field contains a usable search term.
 * @param {string} searchTerm - Text from the searchbar.
 * @returns {boolean} True if the term is not empty after trimming.
 */
function isSearchActive(searchTerm) {
  return searchTerm.trim() !== "";
}

/**
 * Renders the given tasks on the board after search.
 * @param {Array<Object>} tasks - Tasks matching the search term
 * @param {boolean} showNoResults - True if the "no results" message should be shown.
 */
function renderSearchResults(tasks, showNoResults) {
  emptyTaskLists();
  renderTaskCards(tasks);
  renderEmptyTaskLists();
  setBadgeBackgroundColor();
  toggleNoResultsMessage(showNoResults);
  initializeDragEventsForTaskCards();
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
 * @description Makes an array from the task data that are drawn from firebase.
 * @param {Object.<string, Object>|null} tasksObject - tasks-object from firebase (key = Firebase-ID).
 * @returns {Array<Object>} Array mit allen Tasks, jeder Task enthält zusätzlich seine id.
 */
function createAllTaskArrayFromData(allTaskData) {
  if (!allTaskData) return [];
  return Object.entries(allTaskData).map(([id, task]) => ({ ...task, id }));
}

/**
 * @description Loads the data of all tasks from firebase. 
 * The task data is being converted to an array called 'taskDataArray'.
 * The data from 'taskDataArray' is being pushed to allTasks array. 
 * @returns {Promise<void>}
 */
async function loadTasks() {
  try {
    const allTaskData = await getData("tasks");
    const taskDataArray = createAllTaskArrayFromData(allTaskData);
    taskDataArray.forEach((task) => allTasks.push(task));
  } catch (error) {
    console.error("Fehler beim laden der Tasks", error);
  }
}

/**
 * @description Generates the HTML options for the task card dropdown menu, 
 * excluding the current active status of the task.
 * @param {string|number} taskId - The unique identifier of the task.
 * @param {string} currentStatus - The current status key to filter out from options.
 * @returns {string} HTML string containing all available status movement options.
 */
function getCardMenuOptionsHtml(taskId, currentStatus) {
  let optionsHtml = '';
  for (let i = 0; i < ALL_STATUSES.length; i++) {
    const status = ALL_STATUSES[i];
    if (status.key !== currentStatus) {
      const statusLabel = status.label;
      const statusKey = status.key;
      optionsHtml += getMenuOptionTemplate(taskId, statusLabel, statusKey);
    }
  }
  return optionsHtml;
}

/**
 * @description Moves a task to a new status, updates the board content and saves changes to the backend.
 * @param {string|number} taskId - The unique identifier of the task to move.
 * @param {string} newStatus - The target status key to move the task into.
 * @returns {Promise<void>}
 */
async function moveToStatus(event, taskId, newStatus) {
  event.stopPropagation();
  const task = allTasks.find(task => task.id === taskId);
  if (!task) return;
  const movedTaskCard = document.querySelector('[data-task-id="' + taskId + '"]');
  task.status = newStatus;
  appendTaskListByTaskElement(task, movedTaskCard);
  document.querySelector("#card-menu-" + task.id).innerHTML = getCardMenuOptionsHtml(taskId, newStatus);
  await patchData(`tasks/${task.id}`, { status: task.status });
  renderEmptyTaskLists();
}
