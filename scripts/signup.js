let allUsers = [];

let signUpForm = document.getElementById('signUpForm');
let email = document.getElementById('email');
let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirm-password');
let checkbox = document.getElementById('checkbox');

initEventListeners();

/**
 * Register all event listeners used on the login/signup form
 */
function initEventListeners() {
  checkbox.addEventListener("change", acceptPrivacyPolicy);
  password.addEventListener("input", comparePassword);
  confirmPassword.addEventListener("input", comparePassword);
  email.addEventListener("input", () => email.setCustomValidity(""));
}

/**
 * Navigate back to the login page.
 */
function backtoLogin() {
  window.location.href = "../index.html";
}

async function registerUser(event) {
  if (!signUpForm.reportValidity()) return;
  if (!acceptPrivacyPolicy()) return;
  event.preventDefault();
  if (await checkIfEmailExists(email.value)) {
    email.setCustomValidity("Diese E-Mail-Adresse ist bereits registriert");
    email.reportValidity();
    return;
  }
  email.setCustomValidity("");
  let name = document.getElementById('name');
  let response = await postData('users', { name: name.value, email: email.value, password: password.value });
  allUsers.push({ id: response.name, name: name.value, email: email.value, password: password.value });
  signUpForm.reset();
  signUpSuccessPopUp();
}

function comparePassword() {
  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords do not match");
  } else {
    confirmPassword.setCustomValidity("");
  }
}

function acceptPrivacyPolicy() {
  if (checkbox.checked) {
    checkbox.setCustomValidity("");
    return true;
  } else {
    checkbox.setCustomValidity("Please accept the privacy policy");
    checkbox.reportValidity();
    return false;
  }
}

async function checkIfEmailExists(inputMail) {
  let response = await getData('users', { email: email.value });
  return response ? Object.values(response).some(user => user.email === inputMail) : false;
}

function signUpSuccessPopUp() {
  let dialog = document.getElementById('dialog');
  dialog.showModal();
  setTimeout(() => {
    closeDialog();
    window.location.href = "../index.html";
  }, 1500);
}

function closeDialog() {
  let dialog = document.getElementById('dialog');
  dialog.close();
}