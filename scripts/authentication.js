import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { ref, set, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "./firebaseInit.js";

function initAuth() {
    initPasswordEventListener();
    initLoginEventListeners();
}

function initSignUpEventListeners() {
    const checkboxSignup = document.getElementById('checkbox');
    checkboxSignup.addEventListener("change", acceptPrivacyPolicy);
}

function initEventListenersForRegistrationForm() {
    const inputFields = [
        document.getElementById('email-signup'),
        document.getElementById('sign-up-password'),
        document.getElementById('confirm-password')
    ];
    inputFields.forEach(field => {
        field.addEventListener('input', hideInputErrorMessage);
    });
}

function initPasswordEventListener() {
    passwordInputFields().forEach((field) => {
        if (!field.input || !field.icon || !field.toggle) return;
        field.input.addEventListener('input', () => handleEmptyPasswordInput(field));
        field.input.addEventListener('focus', () => handlePasswordFocus(field));
        field.toggle.addEventListener('click', () => toggleShowPassword(field));
    });
}

function passwordInputFields() {
    return [
        createPasswordField('login-password', 'login-password-toggle-icon'),
        createPasswordField('sign-up-password', 'sign-up-password-toggle-icon'),
        createPasswordField('confirm-password', 'confirm-password-toggle-icon')
    ];
}

function createPasswordField(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    let toggle = null;
    if (icon) {
        toggle = icon.closest('.password-toggle');
    } else {
        toggle = document.querySelector(`.password-toggle[data-password-toggle-for="${inputId}]`) || null;
    }
    return { input: input, icon: icon, toggle: toggle }
}

function handlePasswordFocus(field) {
    if (field.input.type === "password") {
        field.icon.src = "./assets/icons/visibility_off.svg";
        field.icon.alt = "hide password";
        field.toggle.setAttribute("aria-label", "Hide password");
    } else {
        field.input.type = "text";
        field.icon.src = './assets/icons/visibility.svg';
        field.icon.alt = "show password";
        field.toggle.setAttribute("aria-label", "Show password");
    }
}

function handleEmptyPasswordInput(field) {
    if (field.input.value === "") return setPasswordIcon(field, "./assets/icons/lock.svg", "lock-img", "Show password");
    const visible = field.input.type === "text";
    setPasswordIcon(field, visible ? './assets/icons/visibility.svg' : "./assets/icons/visibility_off.svg",
        visible ? "show password" : "hide password", visible ? "Show password" : "Hide password");
}

function setPasswordIcon(field, source, alt, label) {
    field.icon.src = source; field.icon.alt = alt; field.toggle.setAttribute("aria-label", label);
}

function toggleShowPassword(field) {
    if (field.input.type === "password") {
        field.input.type = "text";
        field.icon.src = './assets/icons/visibility.svg';
        field.icon.alt = "show password";
        field.toggle.setAttribute("aria-label", "Show password");
    } else {
        field.input.type = "password";
        field.icon.src = "./assets/icons/visibility_off.svg";
        field.icon.alt = "hide password";
        field.toggle.setAttribute("aria-label", "Hide password");
    }
}

async function registerUser(event) {
    const signUpForm = document.getElementById('auth-form');
    const emailSignup = document.getElementById('email-signup');
    const passwordSignup = document.getElementById('sign-up-password');
    const name = document.getElementById('name');
    event.preventDefault();

    const userData = await saveNewUser(name.value, emailSignup.value, passwordSignup.value);
    if (!(await isRegistrationValid())) return;
    if (!userData) return;
    signUpForm.reset(); signUpSuccessPopUp(); backToLogin();
}

async function isRegistrationValid() {
    const passwordOk = comparePassword();
    const privacyOk = acceptPrivacyPolicy();
    return passwordOk && privacyOk;
}

async function saveNewUser(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await set(ref(db, 'users/' + user.uid), {
            name, email, createdAt: serverTimestamp()
        });
        setEmailExistsFeedback(false);
        return true;
    } catch (error) {
        if (error.code === "auth/email-already-in-use") setEmailExistsFeedback(true);
        else console.error("Fehler beim speichern eines neuen Benutzers", error);
        return false;
    }
}

function setEmailExistsFeedback(emailExists) {
    const border = document.getElementById('invalid-email-border-bottom');
    const message = document.getElementById('invalid-email-msg');
    const input = document.getElementById('email-signup');
    border.classList.toggle('error-message-border-bottom', emailExists);
    message.classList.toggle('visibility-hidden', !emailExists);
    input?.setAttribute('aria-invalid', String(emailExists));
}

function comparePassword() {
    const passwordSignup = document.getElementById('sign-up-password');
    const confirmPasswordSignup = document.getElementById('confirm-password');
    const borderBottom = document.getElementById('confirm-password-border-bottom');
    const invalidPassword = document.getElementById('invalid-pw-confirm-msg');
    const matches = passwordSignup.value === confirmPasswordSignup.value;
    const passwordTooShort = confirmPasswordSignup.value.length < 6;
    const validPassword = matches && !passwordTooShort;
    invalidPassword.textContent = passwordTooShort ? pwTooShortMsg : pwMismatchMsg;
    invalidPassword.classList.toggle('visibility-hidden', validPassword);
    borderBottom.classList.toggle('error-message-border-bottom', !validPassword);
    confirmPasswordSignup.setAttribute('aria-invalid', String(!validPassword));
    return validPassword;
}

function acceptPrivacyPolicy() {
    const checkboxSignup = document.getElementById('checkbox');
    const errorMsg = document.getElementById('privacy-policy-error-msg');

    if (checkboxSignup.checked) {
        errorMsg.classList.add('visibility-hidden');
        checkboxSignup.setAttribute('aria-invalid', 'false');
        return true;
    } else {
        errorMsg.classList.remove('visibility-hidden');
        checkboxSignup.setAttribute('aria-invalid', 'true');
        return false;
    }
}

function resetpricavyPolicityCheckbox() {
    const errorMsg = document.getElementById('privacy-policy-error-msg');
    const checkboxSignup = document.getElementById('checkbox');
    errorMsg.classList.add('visibility-hidden');
    checkboxSignup?.setAttribute('aria-invalid', 'false');
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
    event.preventDefault();
    let userCredential;
    try {
        userCredential = await authenticateLoginForm();
    } catch (error) {
        return showErrorMessageForLogin();
    }
    await completeUserLogin(userCredential);
}

async function authenticateLoginForm() {
    const email = document.getElementById('email');
    const password = document.getElementById('login-password');
    return signInWithEmailAndPassword(auth, email.value, password.value);
}

async function completeUserLogin(userCredential) {
    let userData = {};
    const snapshot = await get(ref(db, 'users/' + userCredential.user.uid));
    if (snapshot.exists()) {
        userData = snapshot.val();
    }
    storeLoggedInUser({ name: userData.name, email: userCredential.user.email }); resetLogin(); document.getElementById('auth-form').reset();
    window.location.href = './pages/summary.html';
}

function storeLoggedInUser(user) {
    const userName = user.name || user.username || user.fullName || user.email.split('@')[0];
    localStorage.setItem('name', userName); localStorage.setItem('email', user.email);
}

function initLoginEventListeners() {
    const inputFields = [
        document.getElementById('email'),
        document.getElementById('login-password')
    ]
    inputFields.forEach(fields => {
        fields.addEventListener('input', resetLogin)
    });
}

function showErrorMessageForLogin() {
    const borderBottom = document.querySelectorAll('.input-content-container');
    const errorMsg = document.getElementById('error-msg');
    const email = document.getElementById('email');
    const password = document.getElementById('login-password');
    errorMsg.classList.remove('visibility-hidden');
    email?.setAttribute('aria-invalid', 'true');
    password?.setAttribute('aria-invalid', 'true');
    borderBottom.forEach(borderColor => {
        borderColor.classList.add('error-message-border-bottom');
    });
}

function hideInputErrorMessage(event) {
    const wrapper = event.currentTarget.closest('.input-wrapper');
    wrapper.querySelector('.input-content-container').classList.remove('error-message-border-bottom');
    const errMsg = wrapper.querySelector('.error-msg');
    if (errMsg) errMsg.classList.add('visibility-hidden');
    event.currentTarget.setAttribute('aria-invalid', 'false');
}

function resetLogin() {
    const borderBottom = document.querySelectorAll('.input-content-container');
    const errorMsg = document.getElementById('error-msg');
    const email = document.getElementById('email');
    const password = document.getElementById('login-password');
    errorMsg.classList.add('visibility-hidden');
    email?.setAttribute('aria-invalid', 'false');
    password?.setAttribute('aria-invalid', 'false');
    borderBottom.forEach(borderColor => {
        borderColor.classList.remove('error-message-border-bottom');
    });
}

function logInGuestUser() {
    const signUpForm = document.getElementById('auth-form');

    localStorage.setItem('name', 'Guest');
    localStorage.removeItem('email');

    resetLogin();
    signUpForm.reset();
    window.location.href = './pages/summary.html';
}

function setOnSubmitAttribute(attr = "userLogin(event)") {
    document.getElementById("auth-form").setAttribute("onsubmit", attr);
}

function configureSignupView() {
    setPageTitle("Sign up");
    setPageBackgroundColor("#1268FF");
    setLegalLinkColor("var(--white-color)");
    setLegalLinkHoverEffect();
    setLogoStyles("var(--white-color)", "none");
    setSignupFormContent();
    initSignUpEventListeners();
    initEventListenersForRegistrationForm();
    initPasswordEventListener();
    setAuthenticationHeaderMargin("0");
}

function setAuthenticationHeaderMargin(marginAttribute) {
    document.querySelector(".auth-header").style.margin = marginAttribute;
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
    styleElementDimensions(SHOW_LOGIN_BUTTON, "var(--back-btn-image-dimensions)");
    setElementVisibility(CHECKBOX_CONTAINER, display);
}

function styleElementDimensions(element, dimensions) {
    element.style.width = dimensions;
    element.style.height = dimensions;
}

function setPageTitle(title) {
    document.title = title;
}

function backToLogin() {
    resetLoginPageStyle();
    renderLoginForm();
    resetLoginFormState();
    initPasswordEventListener();
    initLoginEventListeners();
}

function resetLoginPageStyle() {
    setAuthenticationHeaderMargin(""); setPageTitle("Join Log in"); setOnSubmitAttribute();
    setLogoStyles("#1268FF", "animation: logo-color-change var(--logo-color-change-duration) ease-in forwards");
    setPageBackgroundColor("var(--white-color)"); setHeadlineText("Log in"); resetLegalLinkHoverEffect();
}

function renderLoginForm() {
    document.getElementById("formInputContainer").innerHTML = getInputFieldsForLogin();
    setDisplayForSignupElements(); setDisplayForLoginElements();
}

function resetLoginFormState() {
    resetCheckboxValidity(); resetpricavyPolicityCheckbox();
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

Object.assign(window, { initAuth, setminHeightAnimationOnForm, logInGuestUser, userLogin, configureSignupView, registerUser, backToLogin });
