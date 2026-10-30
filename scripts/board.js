document.addEventListener("DOMContentLoaded", initBoardContent());

async function initBoardContent() {
  await loadTasks();
  renderBoardContent(allTasks);
  initializeTaskSearch();
  initializeDragAndDrop();
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
  return category === "Technical Task" ? "task-category-technical" : "task-category-user-story";
}

/**
 * Creates the HTML for the assigned user badges.
 * @param {string[]} assignedUsers - Initials of assigned users.
 * @returns {string} User badge HTML.
 */
function getUserInitials(assignedUsers) {
  if (!assignedUsers) return "";
  return assignedUsers.map((initials) => getUserBadgeTemplate(getInitials(initials).toUpperCase())).join("");
}

/**
 * Creates the HTML for a task's subtask progress.
 * @param {{completed: number, total: number}|undefined} subtasks - Subtask counts.
 * @returns {string} Progress HTML.
 */
function getSubtaskDataProgressHtml(subtasks, id) {
  if(!subtasks) return getSubtaskProgressTemplate(0, 0, 0, id);
  const totalSubtasks = subtasks.length;
  const  completedSubtasks = countCompletedSubtasks(subtasks);
  let  progress = (completedSubtasks / totalSubtasks) * 100;
  if(isNaN(progress)) progress = 0;
  return getSubtaskProgressTemplate(completedSubtasks, progress, totalSubtasks, id); 
}

function countCompletedSubtasks(subtasks) {
  let completedSubtasks = 0;
  if(!subtasks) return completedSubtasks;
  subtasks.map((subtask) => {
    if(subtask.done === true) completedSubtasks++
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
  if(tasks) renderTaskCards(tasks);
  renderEmptyTaskLists();
  setBadgeBackgroundColor();
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

function renderEmptyTaskListContent(taskList) {
  const emptyTaskListMessage = taskList.dataset.emptyText;
  taskList.innerHTML = getEmptyTakListElement(emptyTaskListMessage);
}

function renderTaskListOnEmptyContent(taskList) {
  if(taskList.children.length === 0) {
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
  const taskCardElement = event.currentTarget;
  taskCardElement.id = "grabbed-card";
  taskCardElement.classList.add("task-card-dragging");
  taskCardElement.classList.add("task-card-drop-before");
}

/**
 * Removes the visual dragging state from a card.
 * @param {DragEvent} event - Card drag event.
 * @returns {void}
 */
function stopDragging(event) {
  const taskCardElement = event.currentTarget;
  const taskList = event.target.closest?.(".task-list");

  taskList.classList.remove("task-list-dragover");
  taskList.classList.remove("task-list-drop-end");
  taskCardElement.removeAttribute("id");
  taskCardElement.classList.remove("task-card-dragging");
  taskCardElement.classList.remove("task-card-drop-before");
}

/**
 * Allows a task to be dropped into a board column.
 * @param {DragEvent} event - Column drag event.
 * @returns {void}
 */
function dragTaskCardOverTaskList(event) {
  if (!document.getElementById("grabbed-card")) return;
  event.preventDefault();
  const taskList = event.currentTarget;
  taskList.classList.add("task-list-dragover");
  taskList.classList.add("task-list-drop-end");
  movePlaceholder(event);
}

/**
 * Removes the visual drop target state from a column.
 * @param {DragEvent} event - Column drag event.
 * @returns {void}
 */
function leaveTaskCardDropZone(event) {
  const taskList = event.currentTarget;
  if(taskList.contains(event.relatedTarget)) return;
  const placeholder = taskList.querySelector(".placeholder");
  placeholder?.remove();
  taskList.classList.remove("task-list-dragover");
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
  event.preventDefault();
  const taskList = event.currentTarget;
  const placeholder = taskList.querySelector(".placeholder");
  const taskCard = document.getElementById("grabbed-card");
  if(!placeholder) return;
  taskCard.remove();
  taskList.insertBefore(taskCard, placeholder);
  removeEmptyTaskListElement(taskList);
  placeholder.remove();
  const task = allTasks.find(({ id }) => id === taskCard.getAttribute("data-task-id"));
  renderEmptyTaskLists();
  changeTaskStatus(task, taskList.dataset.status);
  await patchData(`tasks/${task.id}`, { status: task.status });
}

function removeEmptyTaskListElement(taskList) {
  if(isEmptyTaskListElementInTaskList(taskList)) {
    taskList.children[0].remove();
  }
}

function isEmptyTaskListElementInTaskList(taskList) {
  return  taskList.children[0].innerText === "No tasks To do" ||
          taskList.children[0].innerText === "No tasks in progress" ||
          taskList.children[0].innerText === "No tasks awaiting feedback" ||
          taskList.children[0].innerText === "No tasks done";
}

/**
 * Adds drop events to every board column.
 * @returns {void}
 */
function initializeDragAndDrop() {
  initializeDragEventsForTaskCards();
  initializeDragAndDropForTaskLists();
}

function initializeDragEventsForTaskCards() {
  const taskCards = document.querySelectorAll(".task-card");
  taskCards.forEach((taskCard) => {
    addDragEventListenersToCard(taskCard);
  });
}

function initializeDragAndDropForTaskLists() {
  const taskLists = document.querySelectorAll(".task-list");
  taskLists.forEach((taskList) => {
    taskList.addEventListener("dragover", dragTaskCardOverTaskList);
    taskList.addEventListener("dragleave", leaveTaskCardDropZone);
    taskList.addEventListener("drop", dropTaskIntoTaskList);
  });
}

function addDragEventListenersToCard(card) {
  card.addEventListener("dragstart", startDragging);
  card.addEventListener("dragend", stopDragging);
}

function makePlaceholder(draggedTask) {
  const placeholder = document.createElement("li");
  placeholder.classList.add("placeholder");
  placeholder.style.height = `${draggedTask.offsetHeight}px`;
  placeholder.style.width = `${draggedTask.offsetWidth}px`;
  return placeholder;
}

function isMouseOutOfPlaceholder(event, existingPlaceholder) {
  if (existingPlaceholder) {
    const placeholderRect = existingPlaceholder.getBoundingClientRect();
    if (placeholderRect.top <= event.clientY &&
        placeholderRect.bottom >= event.clientY)
    {
      return true;
    }
    else return false;
  }
}

function setPlaceholderPosition(column, task, existingPlaceholder, draggedTask) {
 if (task === existingPlaceholder) return;
    existingPlaceholder?.remove();
    if (task === draggedTask || task.previousElementSibling === draggedTask)
      return;
    column.insertBefore(
      existingPlaceholder ?? makePlaceholder(draggedTask),
      task,
    );
}

function movePlaceholder(event) {
  event.preventDefault();
  const draggedTask = document.getElementById("grabbed-card");
  const column = event.currentTarget;
  const existingPlaceholder = column.querySelector(".placeholder");
  if(isMouseOutOfPlaceholder(event, existingPlaceholder)) return;
  for (const task of column.children) {
    if (task.getBoundingClientRect().bottom >= event.clientY) {
      setPlaceholderPosition(column, task, existingPlaceholder, draggedTask);
      return;
    }
  }
  existingPlaceholder?.remove();
  if (column.lastElementChild === draggedTask) return;
  column.append(existingPlaceholder ?? makePlaceholder(draggedTask));
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