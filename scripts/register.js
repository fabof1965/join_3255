let allUsers = [];

let registerForm = document.getElementById('registerForm');
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
  password.addEventListener("input", resetPasswordIconIfEmpty);
}

function backtoLogin() {
  window.location.href = "../index.html";
}

async function registerUser(event) {
  if (!registerForm.reportValidity()) {
    return;
  }
  if (!acceptPrivacyPolicity()) {
    return;
  }
  event.preventDefault();
  let name = document.getElementById('name');
  let response = await postData('users', { name: name.value, email: email.value, password: password.value });
  allUsers.push({ id: response.name, name: name.value, email: email.value, password: password.value });
  registerForm.reset();
  window.location.href = "../index.html";
}

function comparePassword() {
  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords do not match");
  } else {
    confirmPassword.setCustomValidity("");
  }
}

function toggleShowPassword() {
  let toggleIcon = document.getElementById('password-toggle-icon');
  if (password.value === "") {
    return;
  }
  if (password.type === "password") {
    password.type = "text";
    toggleIcon.src = '../assets/icons/visibility.svg';
    toggleIcon.alt = "show password";
  } else {
    password.type = "password";
    toggleIcon.src = "../assets/icons/visibility_off.svg";
    toggleIcon.alt = "hide password";
  }
}

function resetPasswordIconIfEmpty() {
  let toggleIcon = document.getElementById('password-toggle-icon');
  if (password.value === "") {
    password.type = "password";
    toggleIcon.src = "../assets/icons/lock.svg";
    toggleIcon.alt = "lock-img";
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