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
  let countUrgent = exampleTasks.filter(duty => duty.priority === "urgent").length;
  displaySummaryNumbers(countToDo, countInProgress, countFeedback, countDone, countBoard, countUrgent);  
}

function displaySummaryNumbers(todo, inprogress, feedback, done, board, urgent ){
  document.getElementById("summary-todo").innerText = todo;
  document.getElementById("summary-inprogress").innerText = inprogress;
  document.getElementById("summary-feedback").innerText = feedback;
  document.getElementById("summary-done").innerText = done;
  document.getElementById("summary-board").innerText = board;
  document.getElementById("summary-urgent").innerText = urgent;
}

// async function loadUserName() {
//   let userNameElement = document.getElementById("username");
//   if (!userNameElement) return;

//     try {
//       // 1. Firebase Daten prüfen (Wir holen alle User aus Firebase)
//       let response = await getData("users");
//       let allUsers = response ? Object.values(response) : [];

//       // 2. Gespeicherte E-Mail prüfen
//       let savedEmail = localStorage.getItem("email") || sessionStorage.getItem("email");
//       let savedName = localStorage.getItem("name");

//       // Firebase email-suche
//       let currentUser = null;
//       if (savedEmail) {
//         currentUser = allUsers.find(function(userItem) {
//          return userItem.email === savedEmail;
//         });
//       }

//       // 3. Wenn es ein Gast ist ODER kein User gefunden wurde, lass das Feld leer ("")
//       if (currentUser && currentUser.name && savedName !== "Guest") {
//         userNameElement.innerText = ", " + currentUser.name; currentUser.name;
//       } else {
//         userNameElement.innerText = ""; 
//       }

//     } catch (error) {
//       console.error("Fehler beim Laden des Benutzernamens:", error);
//       userNameElement.innerText = "";
//   }
// }

async function loadUserName() {
  let nameEl = document.getElementById("username");
  let commaEl = document.getElementById("comma");
  if (!nameEl) return;

  let res = await getData("users");
  let users = res ? Object.values(res) : [];
  let email = localStorage.getItem("email") || sessionStorage.getItem("email");
  let user = users.find(u => u.email === email);
  let isGuest = localStorage.getItem("name") === "Guest";

  let isValidUser = user && user.name && !isGuest;
  nameEl.innerText = isValidUser ? user.name : "";
  if (commaEl) commaEl.style.display = isValidUser ? "inline" : "none";
}