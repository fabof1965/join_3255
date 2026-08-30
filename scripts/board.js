const exampleTasks = [
  {
    category: "User Story",
    title: "Kochwelt Page & Recipe Recommender",
    description: "Build start page with recipe recommendation...",
    status: "inProgress",
    assignedUsers: ["AM", "SM"],
    priority: "low",
    subtasks: { completed: 1, total: 2 },
  },
  {
    category: "Technical Task",
    title: "HTML Base Template Creation",
    description: "Create reusable HTML base templates...",
    status: "awaitFeedback",
    assignedUsers: ["AM"],
    priority: "low",
    subtasks: { completed: 2, total: 3 },
  },
  {
    category: "Technical Task",
    title: "CSS Architecture Planning",
    description: "Define CSS naming conventions and structure...",
    status: "done",
    assignedUsers: ["SM"],
    priority: "low",
    subtasks: { completed: 2, total: 2 },
  },
];


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
 * @param {{completed: number, total: number}} subtasks - Subtask counts.
 * @returns {string} Progress HTML.
 */
function getSubtaskProgressHtml(subtasks) {
  const progress = (subtasks.completed / subtasks.total) * 100;
  return fillTemplate(subtaskProgressTemplate, {
    completed: subtasks.completed,
    total: subtasks.total,
    progress,
  });
}


/**
 * Creates the HTML for one task card.
 * @param {Object} task - Task data displayed on the card.
 * @returns {string} Task card HTML.
 */
function getTaskCardHtml(task) {
  return fillTemplate(taskCardTemplate, {
    categoryClass: getCategoryClass(task.category), category: task.category,
    title: task.title, description: task.description,
    subtaskProgress: getSubtaskProgressHtml(task.subtasks),
    assignedUsers: getAssignedUsersHtml(task.assignedUsers),
    priority: task.priority, prioritySymbol: "↓",
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


renderBoard(exampleTasks);
