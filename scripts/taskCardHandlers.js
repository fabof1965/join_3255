/**
 * @description Prevents eventBubblung and handles the menu-option event by moving the task-card into a new column
 * @param {Event} event The event object
 */
function handleMenuOption(event) {
  event.stopPropagation();
  const menuOption = event.target.closest(".menu-option");
  const newTaskCategory = menuOption.dataset.moveTo;
  const taskId = menuOption.dataset.taskId;
  moveToStatus(event, taskId, newTaskCategory);
}

/**
 * @description Handles opening a popover on a task card and stops event propagation if triggered.
 * @param {MouseEvent|KeyboardEvent} event - The triggering event object.
 * @returns {void}
 */
function handlePopoverOpenOnTaskCard(event) {
  if (onOpenPopoverButton(event)) {
    event.stopPropagation();
    return;
  }
}

/**
 * @description Handles keyboard navigation and interaction on task cards, triggering popovers, menu options, or task dialogs on Enter or Space keys.
 * @param {KeyboardEvent} event - The keyboard event object.
 * @returns {void}
 */
function handleTaskCardKeydown(event) {
  const card = event.target.closest(".task-card");
  if (!card || (event.key !== "Enter" && event.key !== " ")) return;
  if (onOpenPopoverButton(event)) {
    handlePopoverOpenOnTaskCard(event);
    return;
  }
  if (event.target.closest(".menu-option")) {
    handleMenuOption(event);
    return;
  }
  event.preventDefault();
  openTaskCardDialog(card.dataset.taskId);
}

/**
 * @description Listens for changes on subtask checkboxes and triggers the subtask toggle logic.
 * @param {Event} event - The change event object from the DOM.
 * @returns {void}
 */
function handleSubtaskCheckboxChange(event) {
  if (event.target.classList.contains("subtask-checkbox")) {
    const checkbox = event.target;
    const index = Number(checkbox.dataset.indexNumber);
    toggleSubtask(index, checkbox);
  }
}