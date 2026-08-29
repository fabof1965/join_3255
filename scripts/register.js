let allUsers = [];

let backToLogin = document.getElementById('arrow-back');
backToLogin.addEventListener("click", () => {
  window.location.href = "../index.html"
});

// function getUserData() {
//   let name = document.getElementById('name').value;
//   let email = document.getElementById('email').value;
//   let password = document.getElementById('password').value;
//   let confirmPassword = document.getElementById('confirm-password').value;
//   let userData = createUserObject(name, email, password);
//   return userData;
// }

// function createUserObject(name, email, password) {
//   let userObject = {
//     "name": name,
//     "email":email,
//     "password": password
//   };
//   return userObject;
// }

// user Objekt erstellen

// wie würde ich es machen 
  // ich würde die Daten in das Array pushen und dann in der Firebase speichern