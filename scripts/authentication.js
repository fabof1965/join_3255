import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { ref, set, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "./firebaseInit.js";

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

// Object.assign(window, { initAuth, setminHeightAnimationOnForm, addSignupContent, registerUser, backToLogin });