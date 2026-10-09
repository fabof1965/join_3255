/**
 * Stores all tasks loaded from Firebase for the summary page.
 * @type {Array<Object>}
 */
let allTasks = [];

document.addEventListener("DOMContentLoaded", function () {
    initSummary();
});

async function initSummary() {
  await loadTasksForSummary();
  updateSummaryNumbers();
  await loadUserName();
  initCardClicks();
  updateGreetingText();
}

async function loadTasksForSummary() {
  try {
     const taskData = await getData("tasks");
    if (taskData) {
      allTasks = taskData ? Object.values(taskData) : [];
    }
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
    allTasks = [];
  }
}

function updateSummaryNumbers() {
  const totalTasksToDo = allTasks.filter(task => task.status === "toDo").length;
  const totalTasksInProgress = allTasks.filter(task => task.status === "inProgress").length;
  const totalTasksFeedback = allTasks.filter(task => task.status === "awaitFeedback" ).length;
  const totalTasksDone = allTasks.filter(task => task.status === "done" ).length;
  const urgentTasks = allTasks.filter(task => task.priority === "urgent");
  const openTasksOnBoard = totalTasksToDo + totalTasksInProgress + totalTasksFeedback;
  const countUrgent = urgentTasks.length;
  displaySummaryNumbers(totalTasksToDo, totalTasksInProgress, totalTasksFeedback, totalTasksDone, openTasksOnBoard, countUrgent);  
  updateUpcomingDeadline(urgentTasks);
}

function displaySummaryNumbers(todo, inprogress, feedback, done, board, urgent ){
  document.getElementById("summary-todo").innerText = todo;
  document.getElementById("summary-inprogress").innerText = inprogress;
  document.getElementById("summary-feedback").innerText = feedback;
  document.getElementById("summary-done").innerText = done;
  document.getElementById("summary-board").innerText = board;
  document.getElementById("summary-urgent").innerText = urgent;
}

function updateUpcomingDeadline(urgentTasks) {
  const dateEl = document.getElementById("date");
  const tasksWithDate = urgentTasks.filter(duty => duty.dueDate);
  if (tasksWithDate.length === 0) {
    dateEl.innerText = "No deadline";
    return;
  }

  tasksWithDate.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const closestDateStr = tasksWithDate[0].dueDate;
  dateEl.innerText = formatDate(closestDateStr);
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
  let res = await getData("users");
  let users = res ? Object.values(res) : [];
  let email = localStorage.getItem("email") || sessionStorage.getItem("email");
  let user = users.find(u => u.email === email);
  let isGuest = localStorage.getItem("name") === "Guest";

  updateGreetingUI(user, isGuest);
}

function updateGreetingUI(user, isGuest) {
    let nameEl = document.getElementById("username");
    let commaEl = document.getElementById("comma");
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
    if (!greetingEl) return;
    
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
