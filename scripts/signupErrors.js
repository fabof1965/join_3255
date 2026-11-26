import { setLoginErrorText } from './loginErrors.js'

const requiredMsg = "This field is required.";
const emailInUse = "Email already in use.";
const invalidEmailMsg = "Please enter a valid email address.";
const pwTooShortMsg = "Password should be at least 6 characters.";
const pwMismatchMsg = "Passwords do not match.";

/**
 * @description Adds an input event listener for the input fields from the registration.
 */
export function initRegistrationInputEventListeners() {
    const nameInput = document.getElementById('signup-name-input');
    const emailInput = document.getElementById('email-signup');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    nameInput.addEventListener('input', hideInputErrorMessage);
    nameInput.addEventListener('blur', validateNameInput);
    emailInput.addEventListener('input', hideInputErrorMessage);
    emailInput.addEventListener('blur', () => validateEmailInput('email-signup', 'invalid-email-msg'));
    passwordInput.addEventListener('input', hideInputErrorMessage);
    passwordInput.addEventListener('blur', () => validatePasswordInput('signup-password', 'signup-password-err-msg'));
    confirmPasswordInput.addEventListener('input', hideInputErrorMessage);
    confirmPasswordInput.addEventListener('blur', validateConfirmPasswordInput);
}

/**
 * @description Validates the name input.
 * @returns {boolean} True if the name is filled in, otherwise false.
 */
export function validateNameInput() {
    const input = document.getElementById('signup-name-input');
    const valid = Boolean(input.value.trim());
    setInputFieldFeedback(input, 'signup-name-err-msg', valid ? '' : requiredMsg);
    return valid;
}

/**
 * @description Validates the email input.
 * @returns {boolean} True if the email is filled in and has a valid format, otherwise false.
 */
export function validateEmailInput(emailInputId, errorFieldId) {
    const input = document.getElementById(emailInputId);
    const value = input.value.trim();
    const valid = Boolean(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const message = !value ? requiredMsg : valid ? '' : invalidEmailMsg;
    setInputFieldFeedback(input, errorFieldId, message);
    return valid;
    // 'invalid-email-msg'
}

/**
 * @description Validates the password input.
 * @returns {boolean} True if the password is filled in and at least 6 characters long.
 */
export function validatePasswordInput(inputId, passwordFieldId) {
    const input = document.getElementById(inputId);
    const value = input.value;
    let valid = Boolean(value) && value.length >= 6;
    let message = !value ? requiredMsg : valid ? '' : pwTooShortMsg;
    if (inputId === "signup-password") {
        const confirmInput = document.getElementById('confirm-password');
        if (confirmInput.value) validateConfirmPasswordInput();
    } else if (inputId === "login-password"){
        valid = Boolean(value)
        if (value === "") message = requiredMsg;
        if (valid ) message = "";
    }
    setInputFieldFeedback(input, passwordFieldId, message);
    return valid;
    // 'signup-password-err-msg'
}

/**
 * @description Validates that the confirmation password is filled in and matches.
 * @returns {boolean} True if both passwords match.
 */
export function validateConfirmPasswordInput() {
    const passwordInput = document.getElementById('signup-password');
    const confirmInput = document.getElementById('confirm-password');
    const value = confirmInput.value;
    const valid = Boolean(value) && value === passwordInput.value; //value.length >= 6 &&
    let message = '';
    if (!value) message = requiredMsg;
    // else if (value.length < 6) message = pwTooShortMsg;
    else if (value !== passwordInput.value) message = pwMismatchMsg;
    setInputFieldFeedback(confirmInput, 'invalid-pw-confirm-msg', message);
    return valid;
}

/**
 * @description Updates the error message and border for one signup input.
 * @param {HTMLInputElement} input
 * @param {string} errorMessageId
 * @param {string} message
 */
export function setInputFieldFeedback(input, errorMessageId, message) {
    input.closest('.input-content-container').classList.toggle('error-message-border-bottom', Boolean(message));
    setLoginErrorText(document.getElementById(errorMessageId), message);
}

/**
 * @description Displays an error message and a red border whenever the email address is already in use.
 * @param {boolean} emailExists True if email already exists, otherwise false.
 */
export function setEmailExistsFeedback(emailExists) {
    const border = document.getElementById('invalid-email-border-bottom');
    const message = document.getElementById('invalid-email-msg');
    border.classList.toggle('error-message-border-bottom', emailExists);
    if (emailExists) message.textContent = emailInUse;
    message.classList.toggle('visibility-hidden', !emailExists);
}

/**
 * @description Hides the error message and removes the red border of the input field when the user types into it.
 * @param {Event} event - The input event of the field the user is typing in.
 */
function hideInputErrorMessage(event) {
    const wrapper = event.currentTarget.closest('.input-wrapper');
    wrapper.querySelector('.input-content-container').classList.remove('error-message-border-bottom');
    const errMsg = wrapper.querySelector('.error-msg');
    if (errMsg) errMsg.classList.add('visibility-hidden');
}

/**
 * @description Shows an error message if the privacy policy checkbox is not checked.
 */
export function acceptPrivacyPolicy() {
    const checkboxSignup = document.getElementById('checkbox');
    const errorMsg = document.getElementById('privacy-policy-error-msg');
    if (checkboxSignup.checked) {
        errorMsg.classList.add('visibility-hidden');
    } else {
        errorMsg.classList.remove('visibility-hidden');
    }
}

/**
 * @description Resets the privacy policy checkbox error message.
 */
export function resetPrivacyPolicyCheckboxError() {
    const errorMsg = document.getElementById('privacy-policy-error-msg');
    errorMsg.classList.add('visibility-hidden');
}