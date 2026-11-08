import { signInWithEmailAndPassword, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "./firebaseInit.js";
import { addSignupContent } from "./signup.js";

document.addEventListener("DOMContentLoaded", () => initLoginEventListeners());
document.getElementById('show-sign-up-btn').addEventListener('click', () => {
    addSignupContent();
});

/**
 * Initializes all event listeners for the login form.
 * Contains the listeners for the password field, the login field and the form submission.
 */
export function initLoginEventListeners() {
    initPasswordEventListener();
    initLoginInputEventListeners();
    initEventListenersForLoginForm();
}

/**
 * Handles the login form submission.
 * @param {Event} event - Login form submission event.
 */
export function initPasswordEventListener() {
    getLoginPasswordFieldObject().forEach((field) => {
        if (!field.input || !field.icon || !field.togglePasswordVisibility) return;
        field.input.addEventListener('input', () => handleEmptyPasswordInput(field));
        field.togglePasswordVisibility.addEventListener('click', () => togglePasswordVisibility(field));
    });
}

/**
 * Adds an input event listener for the email and password input fields.
 * Each input clears the current error message.
 */
export function initLoginInputEventListeners() {
    const inputFields = [
        document.getElementById('email'),
        document.getElementById('login-password'),
    ];
    inputFields.forEach((field) => {
        field.addEventListener('input', hideLoginErrors)
    });
}

/**
 * Initializes the eventlisteners for the login form.
 */
function initEventListenersForLoginForm() {
    const loginForm = document.getElementById('auth-form');
    handleLoginOnSubmit(loginForm);
}

/**
 * Handles the submit event of the login
 * @param {SubmitEvent} event - Submit event of the login form.
 */
function submitHandler(event) {
    event.preventDefault();
    const loginButton = document.getElementById("login-btn");
    const guestLoginButton = document.getElementById("guest-login-btn")
    if (event.submitter === loginButton) {
        userLogin(event);
    }
    if (event.submitter === guestLoginButton) {
        logInGuestUser();
    }
}

function handleLoginOnSubmit(loginForm) {
    loginForm.addEventListener('submit', (event) => {
        submitHandler(event);
    });
}

export async function userLogin(event) {
    let userCredential;
    try {
        userCredential = await signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('login-password').value);
    } catch (error) {
        return showErrorMessageForLogin(event);
    }
    let userData = {};
    const snapshot = await get(ref(db, 'users/' + userCredential.user.uid));
    if (snapshot.exists()) {
        userData = snapshot.val();
    }
    storeLoggedInUser({ name: userData.name, email: userCredential.user.email }); hideLoginErrors(); document.getElementById('auth-form').reset();
    window.location.href = './pages/summary.html';
}

/**
 * Saves the name and email adress of the logged-in user in the local storage.
 * If no name is given, the part of the email before the "@" is used instead.
 * @param {object} user - The logged-in user.
 * @param {string} [user.name] - Name of the user.
 * @param {string} user.email  - Email of the user.
 */
function storeLoggedInUser(user) {
    const userName = user.name || user.username || user.fullName || user.email.split('@')[0];
    localStorage.setItem('name', userName);
    localStorage.setItem('email', user.email);
}

/**
 * Logs in guest user anonymously, saves the name "Guest" in the local storage
 * and redirects to the summary page.
 * @async
 */
async function logInGuestUser() {
    const loginForm = document.getElementById('auth-form');
    try {
        await signInAnonymously(auth);
    } catch (error) {
        console.error('Guest login failed', error);
        return;
    }
    localStorage.setItem('name', 'Guest');
    localStorage.removeItem('email');
    hideLoginErrors();
    loginForm.reset();
    window.location.href = './pages/summary.html';
}

function getLoginPasswordFieldObject() {
    return [
        createPasswordFieldObject('login-password', 'login-password-toggle-icon'),
    ];
}

/**
 * Collects the input, icon and toggle button of a password field.
 * @param {string} inputId - ID of the password input field.
 * @param {string} iconId - ID of the toggle icon.
 * @returns {{input: HTMLInputElement|null, icon: HTMLImageElement|null, togglePasswordVisibility: HTMLButtonElement|null}} Object with the three elements, `null` if not found.
 */
function createPasswordFieldObject(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    let btnTogglePasswordVisibility = null;
    if (icon) {
        btnTogglePasswordVisibility = icon.closest('.password-toggle');
    } else {
        btnTogglePasswordVisibility = document.querySelector(`.password-toggle[data-password-toggle-for="${inputId}"]`) || null;
    }
    return { input: input, icon: icon, togglePasswordVisibility: btnTogglePasswordVisibility }
}

/**
 * Sets the icon in the password field to reflect the field's current state.
 * Shows a lock icon if the field is empty, otherwise the show/hide icon.
 * @param {object} field - Password field object.
 * @param {HTMLInputElement} field.input - Password input Element.
 */
function handleEmptyPasswordInput(field) {
    if (field.input.value === "") return setPasswordIcon(field, "./assets/icons/lock.svg", "lock-img", "Show password");
    const visible = field.input.type === "text";
    setPasswordIcon(field,
        visible ? './assets/icons/visibility_off.svg' : "./assets/icons/visibility.svg",
        visible ? "hide password" : "show password",
        visible ? "Hide password" : "Show password");
}

/**
 * Toggles the icon and the aria-label of a password field's visibility toggle.
 * @param {object} field - Password field object.
 * @param {HTMLImageElement} field.icon - Icon image of the visibility toggle.
 * @param {HTMLButtonElement} field.togglePasswordVisibility - Button that toggles the password visibility.
 * @param {string} source - Path of the icon image.
 * @param {string} alt - Alt text of the icon image.
 * @param {string} label - Aria-label text of the toggle button.
 */
function setPasswordIcon(field, source, alt, label) {
    field.icon.src = source;
    field.icon.alt = alt;
    field.togglePasswordVisibility.setAttribute("aria-label", label);
}

/**
 * Shows or hides the password and changes the icon.
 * @param {object} field - Password field object.
 * @param {HTMLInputElement} field.input - Password input Element.
 */
function togglePasswordVisibility(field) {
    if (field.input.type === "password") {
        field.input.type = "text";
        setPasswordIcon(field, "./assets/icons/visibility_off.svg", "hide password", "Hide password");
    } else {
        field.input.type = "password";
        setPasswordIcon(field, "./assets/icons/visibility.svg", "show password", "Show password");
    }
}