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

/**
 * Loads the user's name from localStorage or sessionStorage.
 */
async function loadUserName() {
  let userNameElement = document.getElementById("username");
  if (!userNameElement) return;

    try {
      // 1. Firebase Daten prüfen( Wir holen alle User aus Firebase (genau wie bei den Tasks)
      let response = await getData("users");
      let allUsers = response ? Object.values(response) : [];

      // 2. Gespeicherte E-Mail prüfen(Wir suchen, ob im Browser irgendwo eine E-Mail gespeichert wurde)
      let savedEmail = localStorage.getItem("email") || sessionStorage.getItem("email");

      //Firebase email-suche von firebase geladene liste(allUser)
      let currentUser = null;
      if (savedEmail) {
        currentUser = allUsers.find(function(userItem) {
         return userItem.email === savedEmail;
        });
      }
      // 3. Wenn kein User über E-Mail gefunden wird, nehmen wir als Fallback den ersten User aus Firebase (oder "Guest")
      if (currentUser && currentUser.name) {
        userNameElement.innerText = currentUser.name;
        } else {
        userNameElement.innerText = "Guest";
      }

    }catch (error) {
      console.error("Fehler beim Laden des Benutzernamens:", error);
      userNameElement.innerText = "Guest";
  }
}