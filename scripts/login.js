import { signInWithEmailAndPassword, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { auth, db } from "./firebaseInit.js";

document.addEventListener("DOMContentLoaded", () => initAuthEventListeners());

function initAuthEventListeners() {
    initPasswordEventListener();
    initLoginInputEventListeners();
    initEventListenersForLoginForm();
}

/**
 * Handle the login form submission.
 * @param {Event} event - Login form submission event.
 */
export function initPasswordEventListener() {
    getPasswordFieldObjects().forEach((field) => {
        if (!field.input || !field.icon || !field.togglePasswordVisibility) return;
        field.input.addEventListener('input', () => handleEmptyPasswordInput(field));
        field.togglePasswordVisibility.addEventListener('click', () => togglePasswordVisibility(field));
    });
}

export function initLoginInputEventListeners() {
    const inputFields = [
        document.getElementById('email'),
        document.getElementById('login-password'),
    ];
    inputFields.forEach(field => {
        field.addEventListener('input', resetLogin)
    });
}

function initEventListenersForLoginForm() {
    const loginForm = document.getElementById('auth-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const loginButton = document.getElementById("login-btn");
        const guestLoginButton = document.getElementById("guest-login-btn")
        if(event.submitter === loginButton) {
            userLogin();
            return;
        }

        if(event.submitter === guestLoginButton) {
            logInGuestUser();
            return;
        }
    });

    loginForm.addEventListener("keyup", (event) => {
        event.preventDefault();
        if(event.key === "Enter") {
            userLogin();
        }
    });
}

export async function userLogin() {
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
}

function getPasswordFieldObjects() {
    return [
        createPasswordFieldObject('login-password', 'login-password-toggle-icon'),
        createPasswordFieldObject('signup-password', 'signup-password-toggle-icon'),
        createPasswordFieldObject('confirm-password', 'confirm-password-toggle-icon')
    ];
}

function createPasswordFieldObject(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    let btnTogglePasswordVisibility = null;
    if (icon) {
        btnTogglePasswordVisibility = icon.closest('.password-toggle');
    } else {
        btnTogglePasswordVisibility = document.querySelector(`.password-toggle[data-password-toggle-for="${inputId}]`) || null;
    }
    return { input: input, icon: icon, togglePasswordVisibility: btnTogglePasswordVisibility }
}

function handleEmptyPasswordInput(field) {
    if (field.input.value === "") return setPasswordIcon(field, "./assets/icons/lock.svg", "lock-img", "Show password");
    const visible = field.input.type === "text";
    setPasswordIcon(field,
        visible ? './assets/icons/visibility_off.svg' : "./assets/icons/visibility.svg",
        visible ? "hide password" : "show password", 
        visible ? "Hide password" : "Show password");
}

function setPasswordIcon(field, source, alt, label) {
    field.icon.src = source;
    field.icon.alt = alt; 
    field.togglePasswordVisibility.setAttribute("aria-label", label);
}

function togglePasswordVisibility(field) {
    if (field.input.type === "password") {
        field.input.type = "text";
        setPasswordIcon(field, "./assets/icons/visibility_off.svg", "hide password", "Hide password");
    } else {
        field.input.type = "password";
        setPasswordIcon(field, "./assets/icons/visibility.svg", "show password", "Show password");
    }
}