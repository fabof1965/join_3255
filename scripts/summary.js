document.addEventListener("DOMContentLoaded", function () {
  initSummary();
});

async function initSummary() {
  await updateSummaryNumbers();
  await loadUserName();
  initCardClicks();
  updateGreetingText();
}

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

async function updateSummaryNumbers() {
  const allTasks = await loadAllTaskData();
  if (!allTasks) {
    const zero = "0";
    displaySummaryNumbers(zero, zero, zero, zero, zero, zero);
    return;
  }
  const totalTasksToDo = allTasks.filter(task => task.status === "toDo").length;
  const totalTasksInProgress = allTasks.filter(task => task.status === "inProgress").length;
  const totalTasksFeedback = allTasks.filter(task => task.status === "awaitFeedback").length;
  const totalTasksDone = allTasks.filter(task => task.status === "done").length;
  const urgentTasks = allTasks.filter(task => task.priority === "urgent");

  const openTasksOnBoard = totalTasksToDo + totalTasksInProgress + totalTasksFeedback;
  const totalTasksUrgent = urgentTasks.length;

  displaySummaryNumbers(totalTasksToDo, totalTasksInProgress, totalTasksFeedback, totalTasksDone, openTasksOnBoard, totalTasksUrgent);
  updateUpcomingDeadline(urgentTasks);
}

function displaySummaryNumbers(todo, inprogress, feedback, done, board, urgent) {
  document.getElementById("summary-todo").innerText = todo;
  document.getElementById("summary-inprogress").innerText = inprogress;
  document.getElementById("summary-feedback").innerText = feedback;
  document.getElementById("summary-done").innerText = done;
  document.getElementById("summary-board").innerText = board;
  document.getElementById("summary-urgent").innerText = urgent;
}

function updateUpcomingDeadline(urgentTasks) {
  const urgentTaskDates = urgentTasks.filter(duty => {
    if ((duty.dueDate) && (duty.status !== "done"))
      return duty;
  });

  urgentTaskDates.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const closestDateStr = urgentTaskDates[0].dueDate;

  deadlineOutput(closestDateStr, urgentTaskDates);
}

function deadlineOutput(closestDateStr, urgentTaskDates) {
  const dateEl = document.getElementById("date");
  const deadlineInfo = document.getElementById("deadline-info");
  const today = new Date();
  const closestDate = new Date(closestDateStr);
  dateEl.innerText = formatDate(closestDateStr);
  const upcommingDeadline = document.getElementById('upcomming-deadline');

  if (urgentTaskDates.length === 0) {
    dateEl.innerText = "No deadline";
    return;
  } else {
    upcommingDeadline.innerText = "Upcomming deadline";
  }

  if (closestDate < today) {
    deadlineInfo.innerText = "Missed deadline";
    upcommingDeadline.innerText = "";
    return;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (isNaN(date)) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

async function loadUserName() {
  const res = await getData("users");
  const users = res ? Object.values(res) : [];
  const email = localStorage.getItem("email") || sessionStorage.getItem("email");
  const user = users.find(u => u.email === email);
  const isGuest = localStorage.getItem("name") === "Guest";

  updateGreetingUI(user, isGuest);
}

function updateGreetingUI(user, isGuest) {
  const nameEl = document.getElementById("username");
  const commaEl = document.getElementById("comma");
  if (!nameEl) return;
  const showName = user?.name && !isGuest && !isGuestStored();
  nameEl.innerText = showName ? formatUserName(user.name) : "";
  if (commaEl) commaEl.style.display = showName ? "inline" : "none";
}

function isGuestStored() {
  return localStorage.getItem("name") === "Guest" || sessionStorage.getItem("name") === "Guest";
}

function formatUserName(name) {
  const parts = name.trim().split(" ");
  return name.length > 13 ? `${parts[0][0]} ${parts[parts.length - 1]}` : name;
}

function initCardClicks() {
  const selectors = [
    ".blue-head-column",
    ".urgent-task",
    ".tasks-to-do",
    ".task-in-progress",
    ".task-feedback",
    ".task-in-board",
    ".tasks-done"
  ];

  selectors.forEach(addBoardNavigation);
}

function addBoardNavigation(selector) {
  const card = document.querySelector(selector);
  if (card) card.addEventListener("click", () => window.location.href = "board.html");
}


function updateGreetingText() {
  const greetingEl = document.getElementById("greeting");
  const nameEl = document.getElementById("username");
  if (!greetingEl) return;
  if (nameEl.innerText !== "") greetingEl.style.fontWeight = "unset";
  greetingEl.innerText = getDynamicGreeting();
}

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
