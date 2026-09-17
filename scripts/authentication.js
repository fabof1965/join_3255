let allUsers = [];

function initSignUpEventListeners() {
    const emailSignup = document.getElementById('email-signup');
    const passwordSignup = document.getElementById('sign-up-password');
    const confirmPasswordSignup = document.getElementById('confirm-password');
    const checkboxSignup = document.getElementById('checkbox');

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
        field.icon.src = "./assets/icons/visibility_off.svg";
        field.icon.alt = "hide password";
    } else {
        field.input.type = "text";
        field.icon.src = './assets/icons/visibility.svg';
        field.icon.alt = "show password";
    }
}

function handleEmptyPasswordInput(field) {
    if (field.input.value === "") {
        field.icon.src = "./assets/icons/lock.svg";
        field.icon.alt = "lock-img";
    } else if (field.input.type === "text") {
        field.icon.src = './assets/icons/visibility.svg';
        field.icon.alt = "show password";
    } else if (field.input.type === "password") {
        field.icon.src = "./assets/icons/visibility_off.svg";
        field.icon.alt = "hide password";
    }
}

function toggleShowPassword(field) {
    if (field.input.type === "password") {
        field.input.type = "text";
        field.icon.src = './assets/icons/visibility.svg';
        field.icon.alt = "show password";
    } else {
        field.input.type = "password";
        field.icon.src = "./assets/icons/visibility_off.svg";
        field.icon.alt = "hide password";
    }
}

async function registerUser(event) {
    const signUpForm = document.getElementById('auth-form');
    const borderBottom = document.getElementById('invalid-email-border-bottom');
    const emailSignup = document.getElementById('email-signup');
    const passwordSignup = document.getElementById('sign-up-password');
    const name = document.getElementById('name');
    const invalidEmail = document.getElementById('invalid-msg');
    event.preventDefault();
    if (!signUpForm.reportValidity()) return;
    if (!acceptPrivacyPolicy()) return;

    if (await checkIfEmailExists(emailSignup.value)) {
        borderBottom.classList.add('error-message-border-bottom');
        invalidEmail.classList.remove('hide');
        // emailSignup.setCustomValidity("Diese E-Mail-Adresse ist bereits registriert");
        // emailSignup.reportValidity();
        return;
    }
    emailSignup.setCustomValidity("");
    const response = await postData('users', { name: name.value, email: emailSignup.value, password: passwordSignup.value });
    allUsers.push({ id: response.name, name: name.value, email: emailSignup.value, password: passwordSignup.value });
    signUpForm.reset();
    signUpSuccessPopUp();
    backToLogin();
}

function comparePassword() {
    const passwordSignup = document.getElementById('sign-up-password');
    const confirmPasswordSignup = document.getElementById('confirm-password');

    if (passwordSignup.value !== confirmPasswordSignup.value) {
        confirmPasswordSignup.classList.remove('hide');
        // confirmPasswordSignup.setCustomValidity("Passwords do not match");
    } else {
        // confirmPasswordSignup.setCustomValidity("");
    }
}

function acceptPrivacyPolicy() {
    const checkboxSignup = document.getElementById('checkbox');

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
    const emailSignup = document.getElementById('email-signup');
    const response = await getData('users', { email: emailSignup.value });

    return response ? Object.values(response).some(user => user.email === inputMail) : false;
}

function signUpSuccessPopUp() {
    const dialog = document.getElementById('dialog');
    dialog.showModal();
    setTimeout(() => {
        closeDialog();
    }, 1500);
}

function closeDialog() {
    const dialog = document.getElementById('dialog');
    dialog.close();
}

/**
 * Handle the login form submission.
 * @param {Event} event - Login form submission event.
 */
async function userLogin(event) {
    console.log("submit ausgelöst");
    event.preventDefault();
    const signUpForm = document.getElementById('auth-form');
    const emailLogin = document.getElementById('email');
    const passwordLogin = document.getElementById('login-password');
    const response = await getData('users');
    const users = response ? Object.values(response) : [];
    const user = users.find(user => user.email === emailLogin.value && user.password === passwordLogin.value);
    if (user) {
        console.log("user gefunden");
        signUpForm.reset();
        window.location.href = './pages/summary.html';
    } else {
        wrongLogin();
        // passwordLogin.reportValidity();
        // passwordLogin.addEventListener("input", () => passwordLogin.setCustomValidity(""));
    }
}

function wrongLogin() {
    const borderBottom = document.querySelectorAll('.input-wrapper');
    const errorMsg = document.getElementById('error-msg');
    errorMsg.classList.remove('hide');
    borderBottom.classList.add('error-message-border-bottom');
}

function logInGuestUser() {
    const signUpForm = document.getElementById('auth-form');
    const GUEST_USER = {
        email: "guestuser@mail.de",
        password: "guestpassword"
    };
    sessionStorage.setItem(JSON.stringify, GUEST_USER);
    signUpForm.reset();
    window.location.href = './pages/summary_guest.html';
}

function setOnSubmitAttribute(attr = "userLogin(event)") {
    document.getElementById("auth-form").setAttribute("onsubmit", attr);
}

function addSignupContent() {
    setPageTitle("Sign up");
    setPageBackgroundColor("#1268FF");
    setLegalLinkColor("var(--white-color)");
    setLegalLinkHoverEffect();
    setLogoStyles("var(--white-color)", "none");
    setSignupFormContent();
    initSignUpEventListeners();
    initPasswordEventListener();
}

function setLegalLinkColor(color) {
    const legalLinks = document.querySelectorAll('.footer-legal-link');
    legalLinks.forEach(legalLink => {
        legalLink.style.color = color;
    });
}

function setLegalLinkHoverEffect() {
    const legalLinks = document.querySelectorAll('.footer-legal-link');
    legalLinks.forEach(legalLink => {
        legalLink.classList.add('signup-legal-link');
    });
}

function resetLegalLinkHoverEffect() {
    const legalLinks = document.querySelectorAll('.footer-legal-link');
    legalLinks.forEach(legalLink => {
        legalLink.classList.remove('signup-legal-link');
        legalLink.removeAttribute('style');
    });
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
    setPageBackgroundColor("var(--white-color)");
    setHeadlineText("Log in");
    resetLegalLinkHoverEffect();

    const FORM_INPUT_CONTAINER = document.getElementById("formInputContainer");
    FORM_INPUT_CONTAINER.innerHTML = getInputFieldsForLogin();

    setDisplayForSignupElements();
    setDisplayForLoginElements();

    resetCheckboxValidity();
    initPasswordEventListener();
}

function setminHeightAnimationOnForm() {
    document.getElementById("auth-form").classList.add("min-height-animated");
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
    document.getElementById("auth-form").style.backgroundColor = color;
}

function setHeadlineText(text) {
    const HEADING = document.getElementById("heading");
    HEADING.innerHTML = text;
}
