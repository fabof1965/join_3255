/**
 * Stores all tasks loaded from Firebase for the summary page.
 * @type {Array<Object>}
 */
let exampleTasks = [];

document.addEventListener("DOMContentLoaded", function () {
    initSummary();
});

async function initSummary() {
  await loadTasksForSummary();
  UpdateSummaryNumbers();
  await loadUserName();
  initCardClicks();
  updateGreetingText();
}

async function loadTasksForSummary() {
  try {
     const taskData = await getData("tasks");
    if (taskData) {
      exampleTasks = taskData ? Object.values(taskData) : [];
    }
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
    exampleTasks = [];
  }
}

function UpdateSummaryNumbers() {
  let countToDo = exampleTasks.filter(function (duty) {
    return duty.status === "toDo" || duty.status === "todo";
  }).length;
  // const count = (condition) => exampleTasks.filter(condition).length;
  // let countToDo = exampleTasks.filter(duty => duty.status === "toDo" || duty.status === "todo").length;
  let countInProgress = exampleTasks.filter(duty => duty.status === "inProgress").length;
  let countFeedback = exampleTasks.filter(duty => duty.status === "awaitFeedback" ).length;
  let countDone = exampleTasks.filter(duty => duty.status === "done" ).length;
  let countBoard = exampleTasks.length;
  let urgentTasks = exampleTasks.filter(duty => duty.priority === "urgent");
  let countUrgent = urgentTasks.length;
  displaySummaryNumbers(countToDo, countInProgress, countFeedback, countDone, countBoard, countUrgent);  
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
  if (!dateEl) return;

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

  let valid = user && user.name && !isGuest;
  if (valid) {
    let p = user.name.trim().split(" ");
    nameEl.innerText = user.name.length > 13 ? `${p[0][0]} ${p[p.length - 1]}` : user.name;
  } else {
    nameEl.innerText = "";
  }
  if (commaEl) commaEl.style.display = valid ? "inline" : "none";
}
// 1. Die Funktion, die den Klick auf die Karten steuert
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

  selectors.forEach(selector => {
    const card = document.querySelector(selector);
    if (card) {
      card.addEventListener("click", () => {
        window.location.href = "board.html";
      });
    }
  });
}


function updateGreetingText() {
    const greetingEl = document.getElementById("greeting"); // Passe die ID an dein HTML an (z.B. das Element für "Good Morning")
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