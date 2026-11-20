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
 * @description Checks whether the name, email or phone field of the contact form is blank
 * and shows the matching error message for each blank field.
 * @param {Object} contact - The contact data entered in the form. 
 * @param {string} contact.name - Name of the contact.
 * @param {string} contact.email - Email of the contact.
 * @param {string} contact.phone - Phone number of the contact.
 * @param {string} ownId - ID of the contact beeing edited.
 * @returns {boolean} True if at least one of the fields is blank, otherwise false.
 */
function contactFormHasBlankFields(contact) {
    const ids = document.getElementById('edit-contact-dialog').open ? EDIT_CONTACT_FIELD_IDS : ADD_CONTACT_FIELD_IDS;
    const blankName = fieldIsBlankFeedback(contact.name, ...ids.name, enterNameMsg);
    const blankEmail = fieldIsBlankFeedback(contact.email, ...ids.email, enterEmailMsg);
    const blankPhone = fieldIsBlankFeedback(contact.phone, ...ids.phone, enterPhoneMsg);
    return blankName || blankEmail || blankPhone;
}

/**
 * @description Checks if the given value is an empty string.
 * @param {string} value
 * @param {string} errId
 * @param {string} borderId
 * @param {string} blankMsg
 * @returns {Boolean} If the field, which includes the value is an empty string the return value is true, else the return value is false.
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
 * @description Checks if there are validation errors on the contact form.
 * @param {object} contact
 * @param {string} ownId
 * @returns {Boolean} If name, email or phone number exists in firebase true, otherwise false.
 */
async function contactFormHasValidationErrors(contact, ownId = null) {
    const ids = document.getElementById('edit-contact-dialog').open ? EDIT_CONTACT_FIELD_IDS : ADD_CONTACT_FIELD_IDS;
    const allJoinContacts = await getData('contacts');
    const nameExists = checkContactFieldExists(allJoinContacts, 'name', contact.name, ownId, ...ids.name, nameExistsMsg);
    const emailExists = checkContactFieldExists(allJoinContacts, 'email', contact.email, ownId, ...ids.email, emailExistsMsg);
    const phoneExists = checkContactFieldExists(allJoinContacts, 'phone', contact.phone, ownId, ...ids.phone, phoneExistsMsg);
    return nameExists || emailExists || phoneExists;
}

/**
 * @description Checks whether a contact has the same name, email address, or phone number 
 * and show or hides the matching error message. 
 * @param {Object<string, Object>|null} allJoinContacts - All contacts from firebase. 
 * @param {string} field - Name of the contact property to compare.
 * @param {string} value - The value entered by the user.
 * @param {string} ownId - ID of the edited contact.
 * @param {string} errorID - ID of the element that displays the error message.
 * @param {string} borderID - ID of the element whose border is marked as invalid. 
 * @param {string} existsMsg - Error message shown if the value already exists.
 * @returns {boolean} True if another contact already uses this value, otherwise false.
 */
function checkContactFieldExists(allJoinContacts, field, value, ownId, errorID, borderID, existsMsg) {
    const exists = allJoinContacts ? Object.entries(allJoinContacts).some(([id, contact]) => id !== ownId && contact[field] === value) : false;
    updateContactFieldError(errorID, borderID, exists, existsMsg);
    return exists;
}

/**
 * @description Sets error message on contact field.
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
 * input fields are the fields with following id's: 'name', 'email', 'phone', 'existing-contact-name', 'existing-contact-email', 'existing-contact-phone'.
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
 * @description Hides the error message.
 * @param {InputEvent} event
 */
function hideContactErrMsg(event) {
    const wrapper = event.currentTarget.closest('.input-wrapper');
    wrapper.querySelector('.add-contact-content').classList.remove('error-message-border-bottom');
    const errMsg = wrapper.querySelector('.error-msg');
    if (errMsg) errMsg.classList.add('visibility-hidden');
}

/**
 * @description Resets the error messages from the add-contact-dialog.
 */
function resetContactFormErrors() {
    const border = document.querySelectorAll('.add-contact-content');
    border.forEach(borderColor => {
        borderColor.classList.remove('error-message-border-bottom');
    });
    const errMsg = document.querySelectorAll('.error-msg');
    errMsg.forEach(errorMessage => {
        errorMessage.classList.add('visibility-hidden');
    });
}

/**
 * @description Initializes the phone filter on the input fields with id 'phone' and 'existing-contact-phone'.
 */
function initPhoneFilter() {
    addPhoneFilter('phone', 'phone-err-msg', 'wrong-phone-border');
    addPhoneFilter('existing-contact-phone', 'existing-contact-phone-err-msg', 'existing-contact-wrong-phone-border');
}

/**
 * @description Adds a phone filter to the input field with the given inputId.
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
 * @description Validates the input of the phone number.
 */
function validatePhoneInput(input, errorMsg, border) {
    const cleaned = input.value.replace(/[^0-9]/g, "");
    const invalid = cleaned !== input.value;
    input.value = cleaned;
    errorMsg.textContent = "Only digits are allowed";
    errorMsg.classList.toggle('visibility-hidden', !invalid);
    border.classList.toggle('error-message-border-bottom', invalid);
}