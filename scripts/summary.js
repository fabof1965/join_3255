/**
 * @description Initializes the summary page after the DOM has been loaded.
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", function () {
  initSummary();
});

/**
 * @description Initializes all summary page functionality.
 * Loads task data, the current user's name, card click handlers,
 * and the dynamic greeting.
 * @returns {Promise<void>}
 */
async function initSummary() {
  await updateSummaryNumbers();
  await loadUserName();
  initCardClicks();
  updateGreetingText();
}

/**
 * @description Loads all tasks from Firebase.
 * @returns {Promise<Array<object>>} An array containing all tasks.
 */
async function loadAllTaskData() {
  try {
    const taskData = await getData("tasks");
    if (taskData) {
      const allTasks = taskData ? Object.values(taskData) : [];
      return allTasks;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
    return [];
  }
}

/**
 * @description Counts the tasks that have the given status.
 * @param {Object []} tasks - All tasks.
 * @param {string} status - Status to count.
 * @returns {number} Number of matching tasks.
 */
function countByStatus(tasks, status) {
  return tasks.filter((task) => task.status === status).length;
}

/**
 * @description Calculates and displays the task counts for the summary page.
 * Also updates the upcoming deadline based on urgent tasks.
 * @returns {Promise<void>}
 */
async function updateSummaryNumbers() {
  const allTasks = await loadAllTaskData();
  if (!allTasks) displaySummaryNumbers(..."000000");
  const toDo = countByStatus(allTasks, "toDo");
  const inProgress = countByStatus(allTasks, "inProgress");
  const awaitFeedback = countByStatus(allTasks, "awaitFeedback");
  const done = countByStatus(allTasks, "done");
  const urgentTasks = allTasks.filter(task => task.priority === "urgent");
  const openTasksOnBoard = toDo + inProgress + awaitFeedback;
  displaySummaryNumbers(toDo, inProgress, awaitFeedback, done, openTasksOnBoard, urgentTasks.length);
  updateUpcomingDeadline(urgentTasks);
}

/**
 * @description Displays the calculated task numbers in the corresponding summary elements.
 * @param {number|string} todo - Number of tasks to do.
 * @param {number|string} inprogress - Number of tasks in progress.
 * @param {number|string} feedback - Number of tasks awaiting feedback.
 * @param {number|string} done - Number of completed tasks.
 * @param {number|string} board - Number of open tasks on the board.
 * @param {number|string} urgent - Number of urgent tasks.
 * @returns {void}
 */
function displaySummaryNumbers(todo, inprogress, feedback, done, board, urgent) {
  document.getElementById("summary-todo").innerText = todo;
  document.getElementById("summary-inprogress").innerText = inprogress;
  document.getElementById("summary-feedback").innerText = feedback;
  document.getElementById("summary-done").innerText = done;
  document.getElementById("summary-board").innerText = board;
  document.getElementById("summary-urgent").innerText = urgent;
}

/**
 * @description Finds the nearest unfinished urgent task deadline.
 * @param {Array<object>} urgentTasks - Array of urgent tasks.
 * @returns {void}
 */
function updateUpcomingDeadline(urgentTasks) {
  const urgentTaskDates = urgentTasks.filter(task => {
    if ((task.dueDate) && (task.status !== "done"))
      return task.dueDate;
  });
  urgentTaskDates.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const closestDateStr = urgentTaskDates[0]?.dueDate;
  deadlineOutput(closestDateStr, urgentTaskDates);
}

/**
 * @description Updates the deadline information shown on the summary page.
 * @param {string|undefined} closestDateStr - Date string of the nearest deadline.
 * @param {Array<object>} urgentTaskDates - Urgent tasks with a due date.
 * @returns {void}
 */
function deadlineOutput(closestDateStr, urgentTaskDates) {
  const dateEl = document.getElementById("date");
  const today = normalizeDate(new Date());
  const closestDate = normalizeDate(new Date(closestDateStr));
  dateEl.innerText = formatDate(closestDateStr);
  const upcomingDeadline = document.getElementById('deadline-info');
  if (urgentTaskDates.length === 0) {
    dateEl.innerText = "No deadline";
    return;
  }
  upcomingDeadline.innerText = "Upcoming deadline";
  if (closestDate < today) {
    upcomingDeadline.innerText = "Missed deadline";
  }
}

/**
 * @description Forms the given date parameter to another date object without passed time
 * @param {Date} date - Date object
 * @returns Date oject with time 00:00:00 (hours:minutes:seconds)
 */
function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * @description Formats a date string for display.
 * @param {string} dateString - Date string to format.
 * @returns {string} The formatted date or the original value if invalid.
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

/**
 * @description Loads the current user's name from Firebase and updates the greeting UI.
 * @returns {Promise<void>}
 */
async function loadUserName() {
  const { auth } = await import("./firebaseInit.js");
  await auth.authStateReady();
  const uid = auth.currentUser?.uid;
  const user = uid ? await getData("users/" + uid) : null;
  const isGuest = localStorage.getItem("name") === "Guest";
  updateGreetingUI(user, isGuest);
}

/**
 * @description Displays or hides the current user's name in the greeting.
 * @param {object|null} user - User object loaded from Firebase.
 * @param {boolean} isGuest - Indicates whether the current user is a guest.
 * @returns {void}
 */
function updateGreetingUI(user, isGuest) {
  const nameEl = document.getElementById("username");
  const commaEl = document.getElementById("comma");
  if (!nameEl) return;
  const showName = user?.name && !isGuest && !isGuestStored();
  nameEl.innerText = showName ? formatUserName(user.name) : "";
  if (commaEl) commaEl.style.display = showName ? "inline" : "none";
}

/**
 * @description Checks whether the guest account is stored in local or session storage.
 * @returns {boolean} True if a guest account is stored, otherwise false.
 */
function isGuestStored() {
  return localStorage.getItem("name") === "Guest" || sessionStorage.getItem("name") === "Guest";
}

/**
 * @description Shortens long user names for display in the greeting.
 * @param {string} name - Full user name.
 * @returns {string} The shortened or original user name.
 */
function formatUserName(name) {
  const parts = name.trim().split(" ");
  return name.length > 13 ? `${parts[0][0]} ${parts[parts.length - 1]}` : name;
}

/**
 * @description Initializes click and enter listener for all elements that include the css class ".summary-card".
 * @returns {void}
 */
function initCardClicks() {
  const summaryCardClass = ".summary-card";
  document.addEventListener("click", (event) => {
    if(event.target.closest(summaryCardClass)) {
      addBoardNavigation();
    }
  });

  document.addEventListener("keyup", (event) => {
    if(event.target.closest(summaryCardClass) && event.key === "Enter") {
      addBoardNavigation();
    }
  })
}

/**
 * @description Navigates to board page.
 */
function addBoardNavigation() {
 window.location.href = "board.html";
}

/**
 * @description Updates the greeting text and adjusts its font weight when a user name is shown.
 * @returns {void}
 */
function updateGreetingText() {
  const greetingEl = document.getElementById("greeting");
  const nameEl = document.getElementById("username");
  if (!greetingEl) return;
  if (nameEl.innerText !== "") greetingEl.style.fontWeight = "unset";
  greetingEl.innerText = getDynamicGreeting();
}

/**
 * @description Returns a greeting based on the current time of day.
 * @returns {string} A morning, afternoon, or evening greeting.
 */
function getDynamicGreeting() {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}
