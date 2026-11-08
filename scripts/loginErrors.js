const wrongEmail = "Check your email and password. Please try again.";
const enterLoginEmailMsg = "Please enter your email.";
const enterLoginPwMsg = "Please enter your password.";

/**
 * 
 * @param {submitter} event 
 * @returns 
 */
function showErrorMessageForLogin(event) {
    if (event.submitter !== document.getElementById("login-btn") || !document.getElementById('email')) return;
    const emailErrMsg = document.getElementById('email-err-msg');
    const passwordErrMsg = document.getElementById('login-password-err-msg');
    const emptyEmailInput = !document.getElementById('email').value.trim();
    const emptyPasswordInput = !document.getElementById('login-password').value.trim();
    setBorderColor();
    if (emptyEmailInput || emptyPasswordInput) {
        setLoginErrorText(emailErrMsg, emptyEmailInput ? enterLoginEmailMsg : '');
        setLoginErrorText(passwordErrMsg, emptyPasswordInput ? enterLoginPwMsg : '')
    } else {
        setLoginErrorText(emailErrMsg, '');
        setLoginErrorText(passwordErrMsg, wrongEmail);
    }
}

/**
 * Highlights the border of the invalid login inputs.
 * An empty field is marked individually; if both are filled, both are marked.
 */
function setBorderColor() {
    const email = document.getElementById('email');
    const password = document.getElementById('login-password');
    const emptyEmail = !email.value.trim();
    const emptyPassword = !password.value.trim();
    const bothFilled = !emptyEmail && !emptyPassword;
    email.closest('.input-content-container').classList.toggle('error-message-border-bottom', emptyEmail || bothFilled);
    password.closest('.input-content-container').classList.toggle('error-message-border-bottom', emptyPassword || bothFilled);
}

/**
 * Sets the error message text and shows or hides the message element.
 * @param {HTMLElement} element - The element that displays the error message below an input field.
 * @param {string} text - The error message to display. An empty string hides the element.
 */
function setLoginErrorText(element, text) {
    element.textContent = text;
    element.classList.toggle('visibility-hidden', !text);
}

function hideLoginErrors() {
    const borderBottom = document.querySelectorAll('.input-content-container');
    const errorMsg = document.getElementById('login-password-err-msg');
    errorMsg.classList.add('visibility-hidden');
    document.getElementById('email-err-msg').classList.add('visibility-hidden');
    borderBottom.forEach(borderColor => {
        borderColor.classList.remove('error-message-border-bottom');
    });
}