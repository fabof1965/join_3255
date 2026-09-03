let allUsers = [];

let signUpForm = document.getElementById('signUpForm');
let name = document.getElementById('name');
let email = document.getElementById('email');
let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirm-password');
let checkbox = document.getElementById('checkbox');

initEventListeners();

function initEventListeners() {
  checkbox.addEventListener("change", acceptPrivacyPolicity);
  password.addEventListener("input", comparePassword);
  confirmPassword.addEventListener("input", comparePassword);
}

function backtoLogin() {
  window.location.href = "../index.html";
}

async function registerUser(event) {
  if (!signUpForm.reportValidity()) {
    return;
  }
  if (!acceptPrivacyPolicity()) {
    return;
  }
  event.preventDefault();
  let name = document.getElementById('name');
  let response = await postData('users', { name: name.value, email: email.value, password: password.value });
  allUsers.push({ id: response.name, name: name.value, email: email.value, password: password.value });
  signUpForm.reset();
  window.location.href = "../index.html";
}

function comparePassword() {
  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords do not match");
  } else {
    confirmPassword.setCustomValidity("");
  }
}

function acceptPrivacyPolicity() {
  if (checkbox.checked) {
    checkbox.setCustomValidity("");
    return true;
  } else {
    checkbox.setCustomValidity("Please accept the privacy policy");
    checkbox.reportValidity();
    return false;
  }
}


// pricavy policity have to checked before sending the form
// wenn ich in das passwort input field klicke soll das Augen Symbol erscheinen
// weiterleitung zur index.html
// wenn ich einfach privacy policity checke und ein passwort eingebe kann ich das form absenden