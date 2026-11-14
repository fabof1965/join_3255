const requiredMsg = "This field is required.";
const emailInUse = "Email already in use.";
const pwTooShortMsg = "Password should be at least 6 characters.";
const pwMismatchMsg = "Passwords do not match.";

/**
 * @description Adds an input event listener for the input fields from the registration.
 */
function initRegistrationInputEventListeners() {
    const inputFields = [
        document.getElementById('signup-name-input'),
        document.getElementById('email-signup'),
        document.getElementById('signup-password'),
        document.getElementById('confirm-password')
    ];
    inputFields.forEach((field) => {
        field.addEventListener('input', hideInputErrorMessage);
    });
}

/**
 * @description Displays an error message and a red border whenever the name
 * and email input fields are empty.
 * @returns {boolean} True if name and email are filled in, otherwise false.
 */
function sendFeedbackForEmptySignupInputfield() {
    const emptyNameInput = !document.getElementById('signup-name-input').value.trim();
    const emptyEmailInput = !document.getElementById('email-signup').value.trim();
    const redBorder = document.getElementById('name-err-msg-border');
    const emailBorder = document.getElementById('invalid-email-border-bottom');
    redBorder.classList.toggle('error-message-border-bottom', emptyNameInput);
    emailBorder.classList.toggle('error-message-border-bottom', emptyEmailInput);
    const nameErrMsg = document.getElementById('signup-name-err-msg');
    const emailErrMsg = document.getElementById('invalid-email-msg');
    if (emptyNameInput || emptyEmailInput) {
        setLoginErrorText(nameErrMsg, emptyNameInput ? requiredMsg : '');
        setLoginErrorText(emailErrMsg, emptyEmailInput ? requiredMsg : '');
    }
    return !emptyNameInput && !emptyEmailInput;
}

/**
 * @description Displays an error message and a red border whenever the email address is already in use.
 * @param {boolean} emailExists True if email already exists, otherwise false.
 */
function setEmailExistsFeedback(emailExists) {
    console.log(emailExists);
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
function acceptPrivacyPolicy() {
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
function resetPrivacyPolicyCheckboxError() {
    const errorMsg = document.getElementById('privacy-policy-error-msg');
    errorMsg.classList.add('visibility-hidden');
}