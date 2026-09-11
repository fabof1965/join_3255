let allUsers = [];

function initSignUpEventListeners() {
    let emailSignup = document.getElementById('email-signup');
    let passwordSignup = document.getElementById('sign-up-password');
    let confirmPasswordSignup = document.getElementById('confirm-password');
    let checkboxSignup = document.getElementById('checkbox');

    checkboxSignup.addEventListener("change", acceptPrivacyPolicy);
    passwordSignup.addEventListener("input", comparePassword);
    confirmPasswordSignup.addEventListener("input", comparePassword);
    emailSignup.addEventListener("input", () => emailSignup.setCustomValidity(""));
}

function initPasswordEventListener() {
    passwordInputFields().forEach((field) => {
        if (!field.input || !field.icon) return;
        field.input.addEventListener('input', () => handleEmptyPasswordInput(field));
        field.input.addEventListener('focus', () => handlePasswordFocus(field));
        field.icon.addEventListener('click', () => toggleShowPassword(field));
    });
}

initPasswordEventListener();

function passwordInputFields() {
    return [
        {
            input: document.getElementById('login-password'),
            icon: document.getElementById('login-password-toggle-icon'),
        },
        {
            input: document.getElementById('sign-up-password'),
            icon: document.getElementById('sign-up-password-toggle-icon'),
        },
        {
            input: document.getElementById("confirm-password"),
            icon: document.getElementById('confirm-password-toggle-icon'),
        },
    ];
}

function handlePasswordFocus(field) {
    if (field.input.type === "password") {
        field.icon.src = "../assets/icons/visibility_off.svg";
        field.icon.alt = "hide password";
    } else {
        field.input.type = "text";
        field.icon.src = '../assets/icons/visibility.svg';
        field.icon.alt = "show password";
    }
}

function handleEmptyPasswordInput(field) {
    if (field.input.value === "") {
        field.icon.src = "../assets/icons/lock.svg";
        field.icon.alt = "lock-img";
    }
}

function toggleShowPassword(field) {
    if (field.input.type === "password") {
        field.input.type = "text";
        field.icon.src = '../assets/icons/visibility.svg';
        field.icon.alt = "show password";
    } else {
        field.input.type = "password";
        field.icon.src = "../assets/icons/visibility_off.svg";
        field.icon.alt = "hide password";
    }
}

async function registerUser(event) {
    let signUpForm = document.getElementById('login-form');
    let emailSignup = document.getElementById('email-signup');
    let passwordSignup = document.getElementById('sign-up-password');
    let name = document.getElementById('name');
    event.preventDefault();
    if (!signUpForm.reportValidity()) return;
    if (!acceptPrivacyPolicy()) return;
    
    if (await checkIfEmailExists(emailSignup.value)) {
        emailSignup.setCustomValidity("Diese E-Mail-Adresse ist bereits registriert");
        emailSignup.reportValidity();
        return;
    }
    emailSignup.setCustomValidity("");
    let response = await postData('users', { name: name.value, email: emailSignup.value, password: passwordSignup.value });
    allUsers.push({ id: response.name, name: name.value, email: emailSignup.value, password: passwordSignup.value });
    signUpForm.reset();
    signUpSuccessPopUp();
    backToLogin();
}

function comparePassword() {
    let passwordSignup = document.getElementById('sign-up-password');
    let confirmPasswordSignup = document.getElementById('confirm-password');

    if (passwordSignup.value !== confirmPasswordSignup.value) {
        confirmPasswordSignup.setCustomValidity("Passwords do not match");
    } else {
        confirmPasswordSignup.setCustomValidity("");
    }
}

function acceptPrivacyPolicy() {
    let checkboxSignup = document.getElementById('checkbox');

    if (checkboxSignup.checked) {
        checkboxSignup.setCustomValidity("");
        return true;
    } else {
        checkboxSignup.setCustomValidity("Please accept the privacy policy");
        checkboxSignup.reportValidity();
        return false;
    }
}

async function checkIfEmailExists(inputMail) {
    let emailSignup = document.getElementById('email-signup');
    let response = await getData('users', { email: emailSignup.value });

    return response ? Object.values(response).some(user => user.email === inputMail) : false;
}

function signUpSuccessPopUp() {
    let dialog = document.getElementById('dialog');
    dialog.showModal();
    setTimeout(() => {
        closeDialog();
    }, 1500);
}

function closeDialog() {
    let dialog = document.getElementById('dialog');
    dialog.close();
}

/**
 * Handle the login form submission.
 * @param {Event} event - Login form submission event.
 */
async function userLogin(event) {
    console.log("submit ausgelöst");
    event.preventDefault();
    let emailLogin = document.getElementById('email');
    let passwordLogin = document.getElementById('login-password');
    let response = await getData('users');
    let users = response ? Object.values(response) : [];
    let user = users.find(user => user.email === emailLogin.value && user.password === passwordLogin.value);
    if (user) {
        console.log("user gefunden");
        window.location.href = './pages/summary.html';
    } else {
        passwordLogin.setCustomValidity("Check your email and password. Please try again");
        passwordLogin.reportValidity();
        passwordLogin.addEventListener("input", () => passwordLogin.setCustomValidity(""));
    }
}

function logInGuestUser() {
    const GUEST_USER = {
        email: "guestuser@mail.de",
        password: "guestpassword"
    };
    sessionStorage.setItem(JSON.stringify, GUEST_USER);
    window.location.href = './pages/summary_guest.html';
}

function setOnSubmitAttribute(attr = "userLogin(event)") {
    document.getElementById("login-form").setAttribute("onsubmit", attr);
}

function addSignupContent() {
    setPageTitle("Sign up");
    setPageBackgroundColor("#1268FF");
    setLogoStyles("white", "none");
    setSignupFormContent();
    initSignUpEventListeners();
    initPasswordEventListener();
}

function setPageBackgroundColor(color) {
    document.body.style.animation = "none";
    document.body.style.backgroundColor = color;
}

function setLogoStyles(color, animationStyles) {
    document.querySelectorAll(".logo-path").forEach(path => {
        setAnimationStyle(path, animationStyles);
        setLogoColor(path, color);
    });
}

function setLogoColor(path, color) {
    path.style.fill = color;
}

function setAnimationStyle(element, animationStyle) {
    element.style.animation = animationStyle;
}

function setElementVisibility(element, visibility) {
    element.style.display = visibility;
}

function setDisplayForLoginElements(display = "flex") {
    const SUBMIT_BUTTON_CONTAINER = document.getElementById("submit-btn-container");
    const SIGNUP_WRAPPER = document.getElementById("signup-wrapper");

    setElementVisibility(SUBMIT_BUTTON_CONTAINER, display);
    setElementVisibility(SIGNUP_WRAPPER, display);
}

function setDisplayForSignupElements(display = "none") {
    const SIGNUP_BUTTON_CONTAINER = document.getElementById("signup-btn-container");
    const SHOW_LOGIN_BUTTON = document.getElementById("btn-show-login");
    const CHECKBOX_CONTAINER = document.getElementById("checkbox-container");

    setElementVisibility(SIGNUP_BUTTON_CONTAINER, display);
    setElementVisibility(SHOW_LOGIN_BUTTON, display);
    setElementVisibility(CHECKBOX_CONTAINER, display);
}

function setPageTitle(title) {
    document.title = title;
}

function backToLogin() {
    setPageTitle("Join Log in");
    setOnSubmitAttribute();

    const ANIMATION_ATTRIBUTE = "animation: logo-color-change var(--logo-color-change-duration) ease-in forwards";

    setLogoStyles("#1268FF", ANIMATION_ATTRIBUTE);
    setPageBackgroundColor("white");
    setHeadlineText("Log in");

    const FORM_INPUT_CONTAINER = document.getElementById("formInputContainer");
    FORM_INPUT_CONTAINER.innerHTML = getInputFieldsForLogin();

    setDisplayForSignupElements();
    setDisplayForLoginElements();

    resetCheckboxValidity();
    initPasswordEventListener();
}

function resetCheckboxValidity() {
    let CHECKBOX = document.getElementById("checkbox");
    CHECKBOX.setCustomValidity("");
}

function setSignupFormContent() {
    setLoginFormBackgroundColor("white");
    setHeadlineText("Sign up");

    const FORM_INPUT_CONTAINER = document.getElementById("formInputContainer");
    FORM_INPUT_CONTAINER.innerHTML = getInputFieldsForSignup();

    setDisplayForSignupElements("flex");
    setDisplayForLoginElements("none");

    setOnSubmitAttribute("registerUser(event)");
}

function setLoginFormBackgroundColor(color) {
    document.getElementById("login-form").style.backgroundColor = color;
}

function getInputFieldsForLogin() {
    return `<div class="input-wrapper">
                <label for="email" class="visually-hidden">Email</label>
                <input id="email" class="input-field" type="email" placeholder="Email" required />
                <img src="./assets/icons/mail.svg" alt="mail icon" />
            </div>
            <div class="input-wrapper">
                <label for="login-password" class="visually-hidden">Passwort</label>
                <input id="login-password" class="input-field" type="password" placeholder="Passwort" required />
                <img id="login-password-toggle-icon" class="lock-img"
                    src="./assets/icons/lock.svg" alt="lock icon" />
            </div>`;
}

function getInputFieldsForSignup() {
    return `<div class="input-wrapper">
                <input class="input-field" type="text" id="name" placeholder="Name" autocomplete="name" required>
                <img src="./assets/icons/person.svg" alt="person logo">
            </div>

            <div class="input-wrapper">
                <input class="input-field" type="email" id="email-signup" placeholder="Email" required>
                <img src="./assets/icons/mail.svg" alt="mail logo">
            </div>

            <div class="input-wrapper"><input class="input-field" type="password" id="sign-up-password" required
                    placeholder="Password">
                <img id="sign-up-password-toggle-icon" class="lock-img" src="./assets/icons/lock.svg" alt="lock-img">
            </div>

            <div class="input-wrapper">
                <input class="input-field" type="password" id="confirm-password" required placeholder="Confirm Password">
                <img id="confirm-password-toggle-icon" class="lock-img"
                    src="./assets/icons/lock.svg" alt="lock logo">
            </div>`;
}

function setHeadlineText(text) {
    const HEADING = document.getElementById("heading");
    HEADING.innerHTML = text;
}

