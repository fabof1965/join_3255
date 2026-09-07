let email = document.getElementById('email');
let password = document.getElementById('password');

function logInGuestUser() {
    const GUEST_USER = {
        email: "guestuser@mail.de",
        password: "guestpassword"
    };
    sessionStorage.setItem(JSON.stringify, GUEST_USER);
    window.location.href = './pages/summary_guest.html';
}

let signUp = document.getElementById('sign-up-btn');
signUp.addEventListener("click", () => {
    // window.location.href = "./pages/signup.html"
    document.getElementById("signup-wrapper").style.display = "none";
    addSignupContent();
});

function addSignupContent() {
    setPageBackgroundColor("#1268FF");
    setLogoColor("white");
    setSignupFormContent();

    console.log("Signup Content is loaded");
}

function setPageBackgroundColor(color) {
    const documentBody = document.body;
    documentBody.style.animation = "none";
    documentBody.style.backgroundColor = color;
}

function setLogoColor(color) {
    document.querySelectorAll(".logo-path").forEach(path => {
        path.setAttribute("fill", color);
    });
}   

function setSignupFormContent() {
    setLoginFormBackgroundColor("white");

    setHeadlineText("Sign up");

    const formInputContainer = document.getElementById("formInputContainer");
    formInputContainer.innerHTML = getInputFieldsForSignup();

    setCheckboxVisibility("flex");
    document.getElementById("submit-btn-container").style.display = "none";
    document.getElementById("signup-btn-container").style.display = "flex";
}

function setLoginFormBackgroundColor(color) {
    document.getElementById("login-form").style.backgroundColor = color;
}

function setCheckboxVisibility(visibility) {
    const checkboxContainer = document.getElementById("checkbox-container");
    checkboxContainer.style.display = visibility;
}

function getInputFieldsForSignup() {
    return `<div class="input-wrapper">
                <input class="input-field" type="text" id="name" placeholder="Name" autocomplete="name" required>
                <img src="../assets/icons/person.svg" alt="person logo">
            </div>

            <div class="input-wrapper">
                <input class="input-field" type="email" id="email" placeholder="Email" required>
                <img src="../assets/icons/mail.svg" alt="mail logo">
            </div>

            <div class="input-wrapper"><input class="input-field" type="password" id="password" required
                    placeholder="Password">
                <img id="password-toggle-icon" class="lock-img" src="../assets/icons/lock.svg" alt="lock-img">
            </div>

            <div class="input-wrapper">
                <input class="input-field" type="password" id="confirm-password" required placeholder="Confirm Password">
                <img id="confirm-password-toggle-icon" class="lock-img"
                    src="../assets/icons/lock.svg" alt="lock logo">
            </div>`;
}

function setHeadlineText(text) {
    const heading = document.getElementById("heading");
    heading.innerHTML = text;
}

password.addEventListener("input", () => {
    password.setCustomValidity("");
})

/**
 * Handle the login form submission.
 * @param {Event} event - Login form submission event.
 */
async function userLogin(event) {
    console.log("submit ausgelöst");
    event.preventDefault();
    let response = await getData('users');
    let users = response ? Object.values(response) : [];
    let user = users.find(user => user.email === email.value && user.password === password.value);
    if (user) {
        console.log("user gefunden");
        window.location.href = './pages/summary.html';
    } else {
        password.setCustomValidity("Check your email and password. Please try again");
        password.reportValidity();
    }
}
