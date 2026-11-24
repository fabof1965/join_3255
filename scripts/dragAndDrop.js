/**
 * Stores the ID of the card that starts being dragged.
 * @param {DragEvent} event - Card drag event.
 * @returns {void}
 */
function startDragging(event) {
  const taskCardElement = event.target.closest(".task-card");
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
  const taskCardElement = event.target.closest(".task-card");
  const taskList = event.target.closest?.(".task-list");
  taskList.classList.remove("task-list-dragover");
  taskList.classList.remove("task-list-drop-end");
  taskCardElement.id = taskCardElement.dataset.taskId;
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
  if (taskList.contains(event.relatedTarget)) return;
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
 * @description Moves the dragged task into the selected board column.
 * @param {DragEvent} event - Column drop event.
 * @returns {void}
 */
async function dropTaskIntoTaskList(event) {
  event.preventDefault();
  const taskList = event.currentTarget;
  const placeholder = taskList.querySelector(".placeholder");
  const taskCard = document.getElementById("grabbed-card");
  if (!placeholder) return;
  taskCard.remove();
  taskList.insertBefore(taskCard, placeholder);
  removeEmptyTaskListElement(taskList);
  placeholder.remove();
  const task = allTasks.find(({ id }) => id === taskCard.getAttribute("data-task-id"));
  renderEmptyTaskLists();
  changeTaskStatus(task, taskList.dataset.status);
  await patchData(`tasks/${task.id}`, { status: task.status });
}

/**
 * @description Removes the "No tasks..." text  from a column on the as soon as a task is added to it.
 * @param {HTMLElement} taskList - The task list element that should display the empty message.
 */
function removeEmptyTaskListElement(taskList) {
  if (isEmptyTaskListElementInTaskList(taskList)) {
    taskList.children[0].remove();
  }
}

/**
 * @description Checks whether the first child of a task list is the "No tasks ..." placeholder.
 * @param {HTMLElement} taskList - The task list element to check.
 * @returns {boolean} True if the placeholder is the first child.
 */
function isEmptyTaskListElementInTaskList(taskList) {
  return taskList.children[0]?.classList.contains("empty-task-list");
}

/**
 * @description Adds drop events to every board column.
 * @returns {void}
 */
function initializeDragAndDrop() {
  initializeDragEventsForTaskCards();
  initializeDragAndDropForTaskLists();
}

/**
 * @description Makes drag-and-drop events available for all task cards on the board.
 */
function initializeDragEventsForTaskCards() {
  document.addEventListener("dragstart", startDragging);
  document.addEventListener("dragend", stopDragging);
}

/**
 * @description Set up drag-and-drop for the board's columns ("To do", "In Progress", "Await feedback" and "Done").
 */
function initializeDragAndDropForTaskLists() {
  const taskLists = document.querySelectorAll(".task-list");
  taskLists.forEach((taskList) => {
    taskList.addEventListener("dragover", dragTaskCardOverTaskList);
    taskList.addEventListener("dragleave", leaveTaskCardDropZone);
    taskList.addEventListener("drop", dropTaskIntoTaskList);
  });
}

/**
 * @description Creates a placeholder element for drag-and-drop on the board.
 * @param {HTMLElement} draggedTask - The dragged task card.
 * @returns {HTMLLIElement} The placeholder element.
 */
function makePlaceholder(draggedTask) {
  const placeholder = document.createElement("div");
  placeholder.classList.add("placeholder");
  placeholder.style.height = `${draggedTask.offsetHeight}px`;
  placeholder.style.width = `${draggedTask.offsetWidth}px`;
  return placeholder;
}

/**
 * @description Checks whether the mouse pointer is vertically aligned with the placeholder while dragging.
 * @param {DragEvent} event - The drag event.
 * @param {HTMLLIElement} existingPlaceholder - The Placeholder element.
 * @returns If `true` if the pointer is between the placeholder's top and bottom edge,
 * `false` if it is outside `undefined` if no placeholder exists. 
 */
function isMouseOutOfPlaceholder(event, existingPlaceholder) {
  if (existingPlaceholder) {
    const placeholderRect = existingPlaceholder.getBoundingClientRect();
    if (placeholderRect.top <= event.clientY &&
      placeholderRect.bottom >= event.clientY) {
      return true;
    }
    else return false;
  }
}

/**
 * @description Positions the placeholder in the column at the spot where the dragged task would be dropped.
 * @param {HTMLElement} column - Column for "To do", "In progress", "Await feedback" and "Done".
 * @param {HTMLElement} task - The task card.
 * @param {HTMLLIElement} existingPlaceholder - The Placeholder element.
 * @param {HTMLElement} draggedTask - The dragged task card.
 * @returns {void}
 */
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

/**
 * @description Moves the placeholder element to the position a dragged card would be put to.
 * The placeholder position depends on the y-axis of the mouse.
 * @param {DragEvent} event 
 * @returns {void}
 */
function movePlaceholder(event) {
  event.preventDefault();
  const draggedTask = document.getElementById("grabbed-card");
  const column = event.currentTarget;
  const existingPlaceholder = column.querySelector(".placeholder");
  if (isMouseOutOfPlaceholder(event, existingPlaceholder)) return;
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