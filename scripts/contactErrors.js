initPhoneFilter();
setErrEventListeners();

const ADD_CONTACT_FIELD_IDS = {
    name: ['name-err-msg', 'wrong-name-border'],
    email: ['email-err-msg', 'wrong-email-border'],
    phone: ['phone-err-msg', 'wrong-phone-border']
}

const EDIT_CONTACT_FIELD_IDS = {
    name: ['existing-contact-name-err-msg', 'existing-contact-wrong-name-border'],
    email: ['existing-contact-email-err-msg', 'existing-contact-wrong-email-border'],
    phone: ['existing-contact-phone-err-msg', 'existing-contact-wrong-phone-border']
}

/**
 * Checks if the contact form has input fields that are not filled with text
 * @param {JSON} contact 
 * @returns {boolean} true if the contact form has fields that are not filled, false if all fields are filled
 */
function contactHasBlankFields(contact) {
    const ids = document.getElementById('edit-contact-dialog').open ? EDIT_CONTACT_FIELD_IDS : ADD_CONTACT_FIELD_IDS;
    const blankName = fieldIsBlankFeedback(contact.name, ...ids.name, enterNameMsg);
    const blankEmail = fieldIsBlankFeedback(contact.email, ...ids.email, enterEmailMsg);
    const blankPhone = fieldIsBlankFeedback(contact.phone, ...ids.phone, enterPhoneMsg);
    return blankName || blankEmail || blankPhone;
}

/**
 * @description Checks if the given value is an empty string
 * @param {string} value 
 * @param {string} errId 
 * @param {string} borderId 
 * @param {string} blankMsg 
 * @returns {Boolean} If the field, which includes the value is an empty string the return value is true, else the return value is false
 */
function fieldIsBlankFeedback(value, errId, borderId, blankMsg) {
    const errMsg = document.getElementById(errId);
    const isBlank = value.trim() === "";
    if (isBlank) errMsg.textContent = blankMsg;
    errMsg.classList.toggle('visibility-hidden', !isBlank);
    document.getElementById(borderId).classList.toggle('error-message-border-bottom', isBlank);
    return isBlank;
}

/**
 * Checks if the given contact name is already available in firebase database
 * @param {string} inputName 
 * @param {string|null} ownId 
 * @param {string} errorID 
 * @param {string} borderID 
 * @returns {Promise<boolean>} If the given input name is found in firebase, the return value is true, else the return value is false
 */
async function checkIfContactNameExists(inputName, ownId = null, errorID = 'name-err-msg', borderID = 'wrong-name-border') {
    return checkContactFieldExists('name', inputName, ownId, errorID, borderID, nameExistsMsg);
}

/**
 * Checks if the given email is already available in firebase database
 * @param {string} inputName 
 * @param {string|null} ownId 
 * @param {string} errorID 
 * @param {string} borderID 
 * @returns {Promise<boolean>} If the given input mail is found in firebase, the return value is true, else the return value is false
 */
async function checkIfEmailExists(inputMail, ownId = null, errorID = 'email-err-msg', borderID = 'wrong-email-border') {
    return checkContactFieldExists('email', inputMail, ownId, errorID, borderID, emailExistsMsg);
}

/**
 * Checks if the given phone number is already available in firebase database
 * @param {string} inputName 
 * @param {string|null} ownId 
 * @param {string} errorID 
 * @param {string} borderID 
 * @returns {Promise<boolean>} If the given input phone is found in firebase, the return value is true, else the return value is false
 */
async function checkIfPhoneNumberExists(inputPhone, ownId = null, errorID = 'phone-err-msg', borderID = 'wrong-phone-border') {
    return await checkContactFieldExists('phone', inputPhone, ownId, errorID, borderID, phoneExistsMsg);
}

/**
 * @description Checks if the value that the user put in already exists in firebase database
 * @param {string} field 
 * @param {string} value 
 * @param {string} ownId 
 * @param {string} errorID 
 * @param {string} borderID 
 * @param {string} existsMsg 
 * @returns {Promise<Boolean>} True if the value from the input field is already saved in firebase, else false
 */
async function checkContactFieldExists(field, value, ownId, errorID, borderID, existsMsg) {
    const response = await getData('contacts');
    const exists = response ? Object.entries(response).some(([id, contact]) => id !== ownId && contact[field] === value) : false;
    updateContactFieldError(errorID, borderID, exists, existsMsg);
    return exists;
}

/**
 * @description Sets error message on contact field
 * @param {string} errorID 
 * @param {string} borderID 
 * @param {boolean} exists 
 * @param {string} existsMsg 
 */
function updateContactFieldError(errorID, borderID, exists, existsMsg) {
    const errMsg = document.getElementById(errorID);
    if (exists) errMsg.textContent = existsMsg;
    errMsg.classList.toggle('visibility-hidden', !exists);
    document.getElementById(borderID).classList.toggle('error-message-border-bottom', exists);
}

/**
 * @description Sets error eventListeners to hide the errors on Contact fields if a contact field has user input
 * input fields are the fields with following id's: 'name', 'email', 'phone', 'existing-contact-name', 'existing-contact-email', 'existing-contact-phone'
 */
function setErrEventListeners() {
    const inputFields = [
        document.getElementById('name'),
        document.getElementById('email'),
        document.getElementById('phone'),
        document.getElementById('existing-contact-name'),
        document.getElementById('existing-contact-email'),
        document.getElementById('existing-contact-phone')
    ];
    inputFields.forEach(field => {
        field.addEventListener('input', hideContactErrMsg);
    });
}

/**
 * @description Hides the error message 
 * @param {InputEvent} event 
 */
function hideContactErrMsg(event) {
    const wrapper = event.currentTarget.closest('.input-wrapper');
    wrapper.querySelector('.add-contact-content').classList.remove('error-message-border-bottom');
    const errMsg = wrapper.querySelector('.error-msg');
    if (errMsg) errMsg.classList.add('visibility-hidden');
}

/**
 * @description Initializes the phone filter on the input fields with id 'phone' and 'existing-contact-phone'
 */
function initPhoneFilter() {
    addPhoneFilter('phone', 'phone-err-msg', 'wrong-phone-border');
    addPhoneFilter('existing-contact-phone', 'existing-contact-phone-err-msg', 'existing-contact-wrong-phone-border');
}

/**
 * @description Adds a phone filter to the input field with the given inputId
 * @param {string} inputId 
 * @param {string} errorMsgId 
 * @param {string} borderId 
 */
function addPhoneFilter(inputId, errorMsgId, borderId) {
    const input = document.getElementById(inputId);
    const errorMsg = document.getElementById(errorMsgId);
    const border = document.getElementById(borderId);
    input.addEventListener('input', () => validatePhoneInput(input, errorMsg, border));
}

/**
 * @description Validates the input of the phone number
 */
function validatePhoneInput(input, errorMsg, border) {
    const cleaned = input.value.replace(/[^0-9]/g, "");
    const invalid = cleaned !== input.value;
    input.value = cleaned;
    errorMsg.textContent = "Only digits are allowed";
    errorMsg.classList.toggle('visibility-hidden', !invalid);
    border.classList.toggle('error-message-border-bottom', invalid);
}

/**
 * @description Checks if there are validation errors on the contact form 
 * @param {object} contact 
 * @param {string} ownId 
 * @returns {Boolean} if name, email or phone number exists in firebase true, else false
 */
async function contactFormHasValidationErrors(contact, ownId) {
    const nameExists = await checkIfContactNameExists(contact.name, ownId, 'existing-contact-name-err-msg', 'existing-contact-wrong-name-border');
    const emailExists = await checkIfEmailExists(contact.email, ownId, 'existing-contact-email-err-msg', 'existing-contact-wrong-email-border');
    const phoneExists = await checkIfPhoneNumberExists(contact.phone, ownId, 'existing-contact-phone-err-msg', 'existing-contact-wrong-phone-border');
    return nameExists || emailExists || phoneExists;
}