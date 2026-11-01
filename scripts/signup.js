import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "./firebaseInit.js";
import { initLoginEventListeners, initPasswordEventListener, userLogin } from './login.js';

initSignUpEventListeners();
addSignupContent();
setminHeightAnimationOnForm();
backToLogin();


function initSignUpEventListeners() {
    const checkboxSignup = document.getElementById('checkbox');
    checkboxSignup.addEventListener("change", acceptPrivacyPolicy);
}

async function registerUser(event) {
    const signUpForm = document.getElementById('auth-form');
    const emailSignup = document.getElementById('email-signup');
    const passwordSignup = document.getElementById('signup-password');
    const signupNameInput = document.getElementById('signup-name-input');
    event.preventDefault();
    if (!(await isRegistrationValid())) return;
    const userData = await saveNewUser(signupNameInput.value, emailSignup.value, passwordSignup.value);
    if (!userData) return;
    signUpForm.reset(); signUpSuccessPopUp(); showLoginForm();
}

async function isRegistrationValid() {
    const privacyOk = document.getElementById("checkbox").checked;
    const inputOk = sendFeedbackForEmptySignupInputfield();
    const passwordOk = validatePassword();
    return inputOk && passwordOk && privacyOk;
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

function validatePassword() {
    const passwordSignup = document.getElementById('signup-password');
    const confirmPasswordSignup = document.getElementById('confirm-password');
    const borderBottom = [
        passwordSignup.closest('.input-content-container'),
        confirmPasswordSignup.closest('.input-content-container')
    ];
    const invalidPassword = document.getElementById('invalid-pw-confirm-msg');
    const passwordErrMsg = document.getElementById('signup-password-err-msg');
    const matches = passwordSignup.value === confirmPasswordSignup.value;
    const emptyPassword = !passwordSignup.value.trim();
    const passwordTooShort = confirmPasswordSignup.value.length < 6;
    const validPassword = matches && !passwordTooShort && !emptyPassword;
    invalidPassword.textContent = emptyPassword ? requiredMsg : passwordTooShort ? pwTooShortMsg : pwMismatchMsg;
    invalidPassword.classList.toggle('visibility-hidden', validPassword);
    passwordErrMsg.textContent = invalidPassword.textContent;
    passwordErrMsg.classList.toggle('visibility-hidden', validPassword);
    borderBottom.forEach(borderColor => { borderColor.classList.toggle('error-message-border-bottom', !validPassword); });
    return validPassword;
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

function backToLogin() {
    document.getElementById('btn-show-login').addEventListener('click', showLoginForm);
}

function showLoginForm() {
    resetLoginPageStyle();
    renderLoginForm();
    resetLoginFormState();
    initPasswordEventListener();
    initLoginEventListeners();
}

function setSubmitHandler(handler = userLogin) {
    const form = document.getElementById("auth-form");
    form.removeEventListener("submit", userLogin);
    form.removeEventListener("submit", registerUser);
    form.addEventListener("submit", handler);
}

function addSignupContent() {
    document.getElementById('show-sign-up-btn').addEventListener('click', () => {
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
    });
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

function resetLoginPageStyle() {
    setAuthenticationHeaderMargin(""); setPageTitle("Join Log in"); setSubmitHandler();
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
    setSubmitHandler(registerUser);
}

function setLoginFormBackgroundColor(color) {
    document.getElementById("auth-form").style.backgroundColor = color;
}

function setHeadlineText(text) {
    const HEADING = document.getElementById("heading");
    HEADING.innerHTML = text;
}