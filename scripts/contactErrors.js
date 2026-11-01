// function validatePhoneInput(input, errorMsg, border) {
//     const cleaned = input.value.replace(/[^0-9]/g, "");
//     const invalid = cleaned !== input.value;
//     input.value = cleaned;
//     errorMsg.textContent = "Only digits are allowed";
//     errorMsg.classList.toggle('visibility-hidden', !invalid);
//     border.classList.toggle('error-message-border-bottom', invalid);
// }

// function initPhoneFilter() {
//     addPhoneFilter('phone', 'phone-err-msg', 'wrong-phone-border');
//     addPhoneFilter('existing-contact-phone', 'existing-contact-phone-err-msg', 'existing-contact-wrong-phone-border');
// }

// function addPhoneFilter(inputId, errorMsgId, borderId) {
//     const input = document.getElementById(inputId);
//     const errorMsg = document.getElementById(errorMsgId);
//     const border = document.getElementById(borderId);
//     input.addEventListener('input', () => validatePhoneInput(input, errorMsg, border));
// }