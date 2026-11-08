const wrongEmail = "Check your email and password. Please try again.";
const enterLoginEmailMsg = "Please enter your email.";
const enterLoginPwMsg = "Please enter your password.";

function showErrorMessageForLogin(event) {
    if(event.submitter !== document.getElementById("login-btn") || !document.getElementById('email')) return;
    const emailErrMsg = document.getElementById('email-err-msg');
    const passwordErrMsg = document.getElementById('login-password-err-msg');
    const emptyEmailInput = !document.getElementById('email').value.trim();
    const emptyPasswordInput = !document.getElementById('login-password').value.trim();
    document.querySelectorAll('.input-content-container').forEach(borderColor => {
        borderColor.classList.add('error-message-border-bottom');
    });
    if (emptyEmailInput || emptyPasswordInput) {
        setLoginErrorText(emailErrMsg, emptyEmailInput ? enterLoginEmailMsg : '');
        setLoginErrorText(passwordErrMsg, emptyPasswordInput ? enterLoginPwMsg : '')
    } else {
        setLoginErrorText(emailErrMsg, '');
        setLoginErrorText(passwordErrMsg, wrongEmail);
    }
}

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