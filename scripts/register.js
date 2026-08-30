let allUsers = [];

let backToLogin = document.getElementById('arrow-back');
backToLogin.addEventListener("click", () => {
  window.location.href = "../index.html"
});

let registerForm = document.getElementById('registerForm');
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  registerUser();
});

let name = document.getElementById('name');
let email = document.getElementById('email');
let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirm-password');
password.addEventListener("input", comparePassword);
confirmPassword.addEventListener("input", comparePassword);
password.addEventListener("input", resetPasswordIconIfEmpty);


async function registerUser() {
  let name = document.getElementById('name');
  let response = await postData('users', { name: name.value, email: email.value, password: password.value });
  allUsers.push({ id: response.name, name: name.value, email: email.value, password: password.value });
  registerForm.reset();
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
    toggleIcon.src = "../assets/icons/visibility.svg"
  } else {
    password.type = "password"
    toggleIcon.src = "../assets/icons/visibility_off.svg"
  }
}

function resetPasswordIconIfEmpty() {
  let toggleIcon = document.getElementById('password-toggle-icon');
  if (password.value === "") {
    password.type = "password";
    toggleIcon.src = "../assets/icons/lock.svg"
  }
}


// pricavy policity have to checked before sending the form
