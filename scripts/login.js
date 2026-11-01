import { signInWithEmailAndPassword, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "./firebaseInit.js";

function initAuth() {
    initPasswordEventListener();
    initLoginEventListeners();
}

logInGuestUser();

/**
 * Handle the login form submission.
 * @param {Event} event - Login form submission event.
 */
export function initPasswordEventListener() {
    passwordInputFields().forEach((field) => {
        if (!field.input || !field.icon || !field.toggle) return;
        field.input.addEventListener('input', () => handleEmptyPasswordInput(field));
        field.input.addEventListener('focus', () => handlePasswordFocus(field));
        field.toggle.addEventListener('click', () => toggleShowPassword(field));
    });
}

export function initLoginEventListeners() {
    const inputFields = [
        document.getElementById('email'),
        document.getElementById('login-password'),
    ];
    inputFields.forEach(field => {
        field.addEventListener('input', resetLogin)
    });
}

async function userLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('login-password');
    let userCredential;
    try {
        userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    } catch (error) {
        return showErrorMessageForLogin();
    }
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
    localStorage.setItem('name', userName);
    localStorage.setItem('email', user.email);
}

async function logInGuestUser() {
    document.getElementById('guest-login').addEventListener('click', async () => {
        const signUpForm = document.getElementById('auth-form');
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error('Guest login failed', error);
            return;
        }
        localStorage.setItem('name', 'Guest');
        localStorage.removeItem('email');
        resetLogin();
        signUpForm.reset();
        window.location.href = './pages/summary.html';
    });
}

function passwordInputFields() {
    return [
        createPasswordField('login-password', 'login-password-toggle-icon'),
        createPasswordField('signup-password', 'signup-password-toggle-icon'),
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

Object.assign(window, { initAuth, logInGuestUser, userLogin });