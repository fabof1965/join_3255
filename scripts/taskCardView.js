/**
 * @description Generates the complete HTML markup for the task details overlay by combining priority, subtasks, and task templates.
 * @param {Object} task - The task object to display in the overlay.
 * @returns {string} The generated HTML string for the task overlay.
 */
function getTaskOverlayHtml(task) {
  const priority = task.priority;
  const subtasksHTML = getOverlaySubtasksHtml(task);
  return getTaskOverlayTemplate(task, priority, subtasksHTML);
}

/**
 * @description Generates the HTML string for the assigned contacts of a given task,
 * returning formatted user templates with initials or a fallback message if no contacts are assigned.
 * @param {Object} task - The task object containing the assigned contacts data.
 * @returns {string} The generated HTML string of user templates or a fallback span.
 */
function getOverlayUsersHtml(task) {
  if (!task.assignedContacts) {
    return `<span>No assigned contacts</span>`;
  }
  const users = task.assignedContacts;
  return users.map((contactName) => {
    return getTaskOverlayUserTemplate(getInitials(contactName), contactName);
  }).join("");
}

/**
 * @description Generates the HTML string for the assigned contacts of a given task,
 * returning formatted user templates with initials or a fallback message if no contacts are assigned.
 * @param {Object} task - The task object containing the assigned contacts data.
 * @returns {string} The generated HTML string of user templates or a fallback span.
 */
function getOverlaySubtasksHtml(task) {
  const subtasks = task.subtasks;
  if (!subtasks) return "";
  return subtasks
    .map((subtask, index) => {
      const isChecked = subtask.done;
      return getSubtaskTemplate(subtask, isChecked, task.id, index);
    })
    .join("");
}

/**
 * @description Returns the appropriate priority icon template based on the given priority level.
 * @param {string} priority - The priority level ("urgent", "medium", "low").
 * @returns {string} The HTML template string for the corresponding priority icon.
 */
function getOverlayPriorityIcon(priority) {
  if (priority === "urgent") return urgentPriorityTemplate;
  if (priority === "medium") return mediumPriorityTemplate;
  return lowPriorityTemplate;
}

/**
 * @description Updates the visual checked state of all subtask checkboxes in the overlay based on task data.
 * @param {Object} task - The task object containing subtasks data.
 * @returns {void}
 */
function setSubtasksCheckedVisually(task) {
  const subtasks = task.subtasks;
  subtasks.forEach((subtask, index) => {
    const checkBox = document.querySelector(
      '[data-index-number="' + index + '"]',
    );
    checkBox.checked = subtask.done;
  });
}

/**
 * @description Toggles the completion status of a subtask, updates the UI checkbox and progress bar,
 * and saves the change to the database.
 * @param {number} index - The index of the subtask in the task's subtasks array.
 * @param {HTMLInputElement} checkbox - The checkbox element associated with the subtask.
 * @returns {Promise<void>}
 */
async function toggleSubtask(index, checkbox) {
  const task = allTasks.find((task) => task.id === openedTaskId);
  const taskIndex = allTasks.findIndex((task) => task.id === openedTaskId);
  if (!task) return;
  task.subtasks[index].done = !task.subtasks[index].done;
  checkbox.checked = task.subtasks[index].done;
  setCheckedAttributesHTML(index, checkbox);
  allTasks[taskIndex] = task;
  await patchData(`tasks/${openedTaskId}/subtasks/${index}`, {
    done: task.subtasks[index].done,
  });
  updateSubtaskProgressOnCard(task.subtasks, openedTaskId);
}

/**
 * @description Updates the checked attributes and aria-states of a DOM element based on the checkbox state.
 * @param {number} index - The index number of the element.
 * @param {HTMLInputElement} checkbox - The checkbox input element.
 * @returns {void}
 */
function setCheckedAttributesHTML(index, checkbox) {
  const checked = checkbox.checked;
  const checkboxElement = document.querySelector('[data-index-number="' + index + '"]');
  checkboxElement.setAttribute("checked", checked);
  checkboxElement.setAttribute("aria-checked", checked);
}

/**
 * @description Calculates the progress percentage of completed subtasks and updates the progress bar and counter UI on the task card.
 * @param {Array<Object>} subtasks - The array of subtask objects for the specific task.
 * @param {string|number} taskID - The unique identifier of the task card.
 * @returns {void}
 */
function updateSubtaskProgressOnCard(subtasks, taskID) {
  const progressFillOnCard = document.getElementById("progress-fill-" + taskID);
  const completedSubtasks = countCompletedSubtasks(subtasks);
  const totalSubtasks = subtasks.length;
  const progress = (completedSubtasks / totalSubtasks) * 100;
  const progressCountOnCard = document.getElementById(
    "subtaskcontainer-" + taskID,
  );
  progressFillOnCard.value = progress;
  progressCountOnCard.innerText = `${completedSubtasks} / ${totalSubtasks} Subtasks`;
}

/**
 * @description Capitalizes the first letter of a given string.
 * @param {string} value - The input string to capitalize.
 * @returns {string} The string with its first letter converted to uppercase.
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}