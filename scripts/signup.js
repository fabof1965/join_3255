import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "./firebaseInit.js";
import { initLoginEventListeners, initPasswordEventListener } from './login.js';

document.getElementById("checkbox").addEventListener("keyup", (event) => {
    handleChackboxChangeOnEnter(event);
});

document.getElementById("checkbox").addEventListener("change", (event) => {
    handleCheckboxChangeOnClick(event);
});

document.getElementById('btn-show-login').addEventListener('click', showLoginForm);

document.getElementById("auth-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const signupButton = document.getElementById("sign-up-btn");
    if (event.submitter === signupButton)
        registerUser(event);
});

/**
 * @description Handles the visual change of the checkbox on enter.
 * @param {KeyboardEvent} event  
 */
function handleChackboxChangeOnEnter(event) {
    event.preventDefault();
    const checkbox = document.getElementById("checkbox");
    if (event.key === "Enter") {
        checkbox.checked = !checkbox.checked;
        acceptPrivacyPolicy();
    }
}

/**
 * @description Handles the visual change of the checkbox on click.
 * @param {click} event  
 */
function handleCheckboxChangeOnClick(event) {
    event.preventDefault();
    acceptPrivacyPolicy();
}

/**
 * @description A new user is registered and the registration is shown by a popup that appears 
 * on successful registration.
 */
async function registerUser() {
    const signUpForm = document.getElementById('auth-form');
    const emailSignup = document.getElementById('email-signup');
    const passwordSignup = document.getElementById('signup-password');
    const signupNameInput = document.getElementById('signup-name-input');
    if (!(await isRegistrationValid())) return;
    const userData = await saveNewUser(signupNameInput.value, emailSignup.value, passwordSignup.value);
    if (!userData) return;
    signUpForm.reset();
    signUpSuccessPopUp();
    showLoginForm();
}

/**
 * @description This function checks if the neccessary fields are filled
 * and password as well as confirm password match.
 */
async function isRegistrationValid() {
    acceptPrivacyPolicy();
    const inputOk = sendFeedbackForEmptySignupInputfield();
    const passwordOk = validatePassword();
    return inputOk && passwordOk;
}

/**
 * @description Saves a user and sends the data up to firebase.
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */
async function saveNewUser(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await set(ref(db, 'users/' + user.uid), {
            name, email, createdAt: serverTimestamp(),
        });
        setEmailExistsFeedback(false);
        return true;
    } catch (error) {
        if (error.code === "auth/email-already-in-use") setEmailExistsFeedback(true);
        else console.error("Fehler beim speichern eines neuen Benutzers", error);
        return false;
    }
}

/**
 * @description Checks if both passwords that are put into the password fields match each other.
 */
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

/**
 * @description Shows and removes popup.
 */
function signUpSuccessPopUp() {
    const dialog = document.getElementById('dialog');
    dialog.showModal();
    setTimeout(() => {
        dialog.close();
    }, 1500);
}

/**
 * @description Sets up the login pages look.
 */
function showLoginForm() {
    setLoginPageStyle();
    renderLoginInputFields();
    setLoginFormState();
    initLoginEventListeners();
}

/**
 * @description Destructures the page into Signup page
 */
export function addSignupContent() {
    setPageTitle("Sign up");
    setPageBackgroundColor("#1268FF");
    setLegalLinkColor("var(--white-color)");
    setLegalLinkHoverEffect();
    setLogoStyles("var(--white-color)", "none");
    setSignupFormContent();
    initPasswordEventListener();
    initRegistrationInputEventListeners();
    setAuthenticationHeaderMargin("0");
}

/**
 * @description Sets the margin attribute value on the auth-header class
 * @param {string} marginAttribute 
 */
function setAuthenticationHeaderMargin(marginAttribute) {
    document.querySelector(".auth-header").style.margin = marginAttribute;
}

/**
 * @description Sets the text color for the legal links of the page
 * @param {string} color 
 */
function setLegalLinkColor(color) {
    const legalLinks = document.querySelectorAll('.footer-legal-link');
    legalLinks.forEach(legalLink => {
        legalLink.style.color = color;
    });
}

/**
 * @description Sets the hover effect of the legal links
 */
function setLegalLinkHoverEffect() {
    const legalLinks = document.querySelectorAll('.footer-legal-link');
    legalLinks.forEach(legalLink => {
        legalLink.classList.add('signup-legal-link');
    });
}

/**
 * @description Sets the hover effect of the legal links to default
 */
function resetLegalLinkHoverEffect() {
    const legalLinks = document.querySelectorAll('.footer-legal-link');
    legalLinks.forEach((legalLink) => {
        legalLink.classList.remove('signup-legal-link');
        legalLink.removeAttribute('style');
    });
}

/**
 * @description Sets the pages background color
 * @param {string} color 
 */
function setPageBackgroundColor(color) {
    document.body.style.animation = "none";
    document.body.style.backgroundColor = color;
}

/**
 * @description Sets styles for the pages logo
 * @param {string} color 
 * @param {string} animationStyles 
 */
function setLogoStyles(color, animationStyles) {
    document.querySelectorAll(".logo-path").forEach(path => {
        setAnimationStyle(path, animationStyles);
        setLogoColor(path, color);
    });
}

/**
 * @description Sets the fill attribute of the logo svg with the given color
 * @param {SVGPathElement} path 
 * @param {string} color 
 */
function setLogoColor(path, color) {
    path.style.fill = color;
}

/**
 * @description Sets the SVG path's animation s 
 * @param {SVGPathElement} path 
 * @param {string} animationStyle 
 */
function setAnimationStyle(path, animationStyle) {
    path.style.animation = animationStyle;
}

/**
 * @description Sets the visibility of the given element by the visibility argument
 * @param {HTMLElement} element 
 * @param {string} visibility 
 */
function setElementVisibility(element, visibility) {
    element.style.display = visibility;
}

/**
 * @description Sets login element's visibility by the display argument
 * @param {string} display 
 */
function setDisplayForLoginElements(display = "flex") {
    const SUBMIT_BUTTON_CONTAINER = document.getElementById("submit-btn-container");
    const SIGNUP_WRAPPER = document.getElementById("signup-wrapper");
    setElementVisibility(SUBMIT_BUTTON_CONTAINER, display);
    setElementVisibility(SIGNUP_WRAPPER, display);
}

/**
 * Sets the signup element's visibility by the display argument 
 * @param {string} display 
 */
function setDisplayForSignupElements(display = "none") {
    const SIGNUP_BUTTON_CONTAINER = document.getElementById("signup-btn-container");
    const SHOW_LOGIN_BUTTON = document.getElementById("btn-show-login");
    const CHECKBOX_CONTAINER = document.getElementById("checkbox-container");
    setElementVisibility(SIGNUP_BUTTON_CONTAINER, display);
    setElementVisibility(SHOW_LOGIN_BUTTON, display);
    styleElementDimensions(SHOW_LOGIN_BUTTON, "var(--back-btn-image-dimensions)");
    setElementVisibility(CHECKBOX_CONTAINER, display);
}

/**
 * @description Sets the width and height attribute of the given HTML Element by dimensions value
 * @param {HTMLElement} element 
 * @param {string} dimensions 
 */
function styleElementDimensions(element, dimensions) {
    element.style.width = dimensions;
    element.style.height = dimensions;
}

/**
 * @description Sets the title for the page 
 * @param {string} title 
 */
function setPageTitle(title) {
    document.title = title;
}

/**
 * @description Sets the styles for login page
 */
function setLoginPageStyle() {
    setAuthenticationHeaderMargin("");
    setPageTitle("Join Log in");
    setLogoStyles("#1268FF", "animation: logo-color-change var(--logo-color-change-duration) ease-in forwards");
    setPageBackgroundColor("var(--white-color)");
    setHeadlineText("Log in");
    resetLegalLinkHoverEffect();
}

/**
 * @description Renders the input fields for login form
 */
function renderLoginInputFields() {
    document.getElementById("formInputContainer").innerHTML = getInputFieldsForLogin();
    setDisplayForSignupElements();
    setDisplayForLoginElements();
}

/**
 * @description Sets the login forms origin state
 */
function setLoginFormState() {
    resetCheckboxValidity();
    resetPrivacyPolicyCheckboxError();
}

/**
 * @description Sets the custom validity of the chackbox to an empty string
 */
function resetCheckboxValidity() {
    const CHECKBOX = document.getElementById("checkbox");
    CHECKBOX.setCustomValidity("");
}

/**
 * @description Sets up the form content for the signup form
 */
function setSignupFormContent() {
    setLoginFormBackgroundColor("white");
    setHeadlineText("Sign up");
    const FORM_INPUT_CONTAINER = document.getElementById("formInputContainer");
    FORM_INPUT_CONTAINER.innerHTML = getInputFieldsForSignup();
    setDisplayForSignupElements("flex");
    setDisplayForLoginElements("none");
    document.getElementById("checkbox").checked = false;
}

/**
 * @description Sets the background color of the login form to the color attribute
 * @param {string} color 
 */
function setLoginFormBackgroundColor(color) {
    document.getElementById("auth-form").style.backgroundColor = color;
}

/**
 * @description Sets the element's headline text to the given text. 
 * The element must contain the id 'heading' to work
 * @param {string} text 
 */
function setHeadlineText(text) {
    const HEADING = document.getElementById("heading");
    HEADING.innerHTML = text;
}