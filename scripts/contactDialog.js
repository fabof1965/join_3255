let isSubmittingContact = false;

initPhoneFilter();
resetErrEventlistener();

document.querySelectorAll(".btn-close-add-contact-dialog").forEach((button) => {
    button.addEventListener("click", (event) => {
        closeDialogHandler(event, closeContactDialog);
    });
});

document.querySelectorAll(".btn-close-edit-dialog").forEach((button) => {
    button.addEventListener("click", (event) => {
        closeDialogHandler(event, closeEditContactDialog);
    });
});

document.getElementById("contact-form").addEventListener("submit", (event) => {
    submitHandler(event);
});

document.getElementById("edit-contact-form").addEventListener("submit", (event) => {
    submitHandler(event);
});

getAddContactDialog().addEventListener("cancel", (event) => {
    closeDialogHandler(event, closeContactDialog);
});

document.getElementById("edit-contact-dialog").addEventListener("cancel", (event) => {
    closeDialogHandler(event, closeEditContactDialog);
});

/**
 * @description Handles the contact form's submit
 * @param {SubmitEvent} event 
 */
function submitHandler(event) {
    event.preventDefault();
    submitContactForm(event);
}

/**
 * @description Handles the cancel event on the dialogs 
 * @param {Cancel} event 
 * @param {calling function} closingFunction 
 */
function closeDialogHandler(event, closingFunction) {
    event.preventDefault();
    editIndex = null;
    closingFunction();
}

/**
 * Gets the dialog element with the given id 'add-contact-dialog'
 * @returns HTML Dialog element
 */
function getAddContactDialog() {
    return document.getElementById("add-contact-dialog");
}

/**
 * @description Opens the dialog that makes it possile to create a new contact
 */
function openContactDialog() {
    const dialog = getAddContactDialog();
    dialog.showModal();
    dialog.classList.add('slide-in');
    clickEventListener(dialog, closeContactDialog);
}

/**
 * @description Closes the 'Add Contact' - Dialog 
 */
function closeContactDialog() {
    const contactDialog = getAddContactDialog();
    const contactForm = document.getElementById('contact-form');
    contactDialog.classList.remove("slide-in");
    setTimeout(() => {
        contactDialog.close();
    }, 500);
    resetContactFormErrors();
    contactForm.reset();
}

/**
 * @description Resets the error messages from the add-contact-dialog
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
 * @description Submits Contact data to firebase
 * @param {SubmitEvent} event 
 * @returns {Promise<void>}
 */
async function submitContactForm(event) {
    event.preventDefault();
    if (isSubmittingContact) return;
    isSubmittingContact = true;
    try {
        if (editIndex === null) {
            await addNewContact();
        } else {
            await saveEditedContact();
        }
    } finally {
        isSubmittingContact = false;
    }
}

/**
 * @description Inserts a new created contact into the contact list and 
 * loads the data into the global allContacts Array as well as to firebase
 * @returns {Promise<void>}
 */
async function addNewContact() {
    const contactList = document.getElementById("contacts");
    const contact = getContactDataFromForm();
    if (contactHasBlankFields(contact)) return;
    const nameExists = await checkIfContactNameExists(contact.name);
    const emailExists = await checkIfEmailExists(contact.email);
    const phoneExists = await checkIfPhoneNumberExists(contact.phone);
    if (nameExists || emailExists || phoneExists) return;
    const response = await postData('contacts', contact);
    const contactObject = { id: response.name, ...contact };
    closeContactDialog();
    allContacts.push(contactObject);
    sortAllContactsByName();
    const newContactIndex = allContacts.findIndex((contact) => contact.id === contactObject.id);
    insertContact(contactList, contactObject.name, newContactIndex);
    showSuccessPopup('Contact successfully created');
}

/**
 * @description Inserts a new contact element into the contact list
 * @param {HTMLElement} contactList 
 * @param {string} newContactName 
 * @param {number} indexContact 
 * @returns {void}
 */
function insertContact(contactList, newContactName, indexContact) {
    const initialLetter = newContactName.charAt(0).toUpperCase();
    const newContactElement = makeNewContactNode(indexContact);
    const firstLetterGroup = [...document.querySelectorAll(`[data-initial-letter="${initialLetter}"]`)];
    
    if (firstLetterGroup.length > 0) {
        insertContactIntoContactGroup(newContactName, newContactElement, firstLetterGroup);
        return;
    }
    
    appendContactListByNewElement(initialLetter, newContactElement, contactList);
}

/**
 * @description Sets the newContactElement to the correct place inside a contact group 
 * @param {string} newContactName 
 * @param {Node} newContactElement 
 * @param {Array<Node>} group 
 */
function insertContactIntoContactGroup(newContactName, newContactElement, group) {
    const nextElement = group.find(contact => contact.dataset.name.localeCompare(newContactName, 'de') > 0);
    if (nextElement) nextElement.before(newContactElement);
    else group.at(-1).after(newContactElement);
    setBadgeBackgroundColor();
    initContactCardListeners(newContactElement);
}

/**
 * @description Inserts the newContactElement to the correct position at the contact list
 * @param {string} initialLetter 
 * @param {Node} newContactElement 
 * @param {HTMLElement} contactList 
 */
function appendContactListByNewElement(initialLetter, newContactElement, contactList) {
    const letterElement = makeLetterElement(initialLetter);
    const seperatorElement = makeSeperatorElement(initialLetter);
    const nextLetter = [...document.querySelectorAll('.letter')].find(letter => letter.dataset.letter.localeCompare(initialLetter, 'de') > 0);
    if (nextLetter) nextLetter.before(letterElement, seperatorElement, newContactElement);
    else contactList.append(letterElement, seperatorElement, newContactElement);
    initContactCardListeners(newContactElement);
    setBadgeBackgroundColor();
}

/**
 * @description Creates a new contact node element and sets all nesseccary attributes
 * @param {number} indexContact 
 * @returns {Node} contact node
 */
function makeNewContactNode(indexContact) {
    const newContactNode = document.createElement("article");
    newContactNode.classList.add("contact-card");
    newContactNode.id = "contact-card" + indexContact;
    newContactNode.role = "button";
    newContactNode.dataset.contactIndex = indexContact;
    newContactNode.dataset.name = allContacts[indexContact].name;
    newContactNode.dataset.initialLetter = allContacts[indexContact].name.charAt(0).toUpperCase();
    newContactNode.tabIndex = 0;
    newContactNode.ariaLabel = "Open contact " + allContacts[indexContact].name;
    newContactNode.innerHTML = getContactCardContentTemplate(indexContact);
    return newContactNode;
}

/**
 * @description Creates a letter Element that represents the headline for a contact group
 * grouped by the initial letter of the contacts belonging to this group 
 * @param {string} letter 
 * @returns {Node} letter node
 */
function makeLetterElement(letter) {
    const letterElement = document.createElement("div");
    letterElement.classList.add("letter");
    letterElement.dataset.letter = letter;
    letterElement.ariaLabel = letter;
    letterElement.innerText = letter;
    return letterElement;
}

/**
 * @description Creates a seperator element 
 * @param {string} letter 
 * @returns {Node} seperator Node
 */
function makeSeperatorElement(letter) {
    const seperator = document.createElement("div");
    seperator.classList.add("seperator");
    seperator.dataset.letter = letter;
    return seperator;
}

/**
 * @description Retrieves the data from the input fields in the contact dialog
 * @returns {JSON} name: 'the name from users input', 
 * email: 'email-address from the users input', 
 * phone: 'pone number from the users input' 
 */
function getContactDataFromForm() {
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };
}

/**
 * Checks if the contact form has input fields that are not filled with text
 * @param {JSON} contact 
 * @returns {boolean} true if the contact form has fields that are not filled, false if all fields are filled
 */
function contactHasBlankFields(contact) {
    const blankName = fieldIsBlankFeedback(contact.name, 'name-err-msg', 'wrong-name-border', enterNameMsg);
    const blankEmail = fieldIsBlankFeedback(contact.email, 'email-err-msg', 'wrong-email-border', enterEmailMsg);
    const blankPhone = fieldIsBlankFeedback(contact.phone, 'phone-err-msg', 'wrong-phone-border', enterPhoneMsg);
    return blankName || blankEmail || blankPhone;
}

function fieldIsBlankFeedback(value, errId, borderId, blankMsg) {
    const errMsg = document.getElementById(errId);
    const isBlank = value.trim() === "";
    if (isBlank) errMsg.textContent = blankMsg;
    errMsg.classList.toggle('visibility-hidden', !isBlank);
    document.getElementById(borderId).classList.toggle('error-message-border-bottom', isBlank);
    return isBlank;
}

async function checkIfContactNameExists(inputName, ownId = null, errorID = 'name-err-msg', borderID = 'wrong-name-border') {
    return checkContactFieldExists('name', inputName, ownId, errorID, borderID, nameExistsMsg);
}

async function checkIfEmailExists(inputMail, ownId = null, errorID = 'email-err-msg', borderID = 'wrong-email-border') {
    return checkContactFieldExists('email', inputMail, ownId, errorID, borderID, emailExistsMsg);
}

async function checkIfPhoneNumberExists(inputPhone, ownId = null, errorID = 'phone-err-msg', borderID = 'wrong-phone-border') {
    return await checkContactFieldExists('phone', inputPhone, ownId, errorID, borderID, phoneExistsMsg);
}

async function checkContactFieldExists(field, value, ownId, errorID, borderID, existsMsg) {
    const response = await getData('contacts');
    const exists = response ? Object.entries(response).some(([id, contact]) => id !== ownId && contact[field] === value) : false;
    updateContactFieldError(errorID, borderID, exists, existsMsg);
    return exists;
}

function updateContactFieldError(errorID, borderID, exists, existsMsg) {
    const errMsg = document.getElementById(errorID);
    if (exists) errMsg.textContent = existsMsg;
    errMsg.classList.toggle('visibility-hidden', !exists);
    document.getElementById(borderID).classList.toggle('error-message-border-bottom', exists);
}

function resetErrEventlistener() {
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

function hideContactErrMsg(event) {
    const wrapper = event.currentTarget.closest('.input-wrapper');
    wrapper.querySelector('.add-contact-content').classList.remove('error-message-border-bottom');
    const errMsg = wrapper.querySelector('.error-msg');
    if (errMsg) errMsg.classList.add('visibility-hidden');
}

function initPhoneFilter() {
    addPhoneFilter('phone', 'phone-err-msg', 'wrong-phone-border');
    addPhoneFilter('existing-contact-phone', 'existing-contact-phone-err-msg', 'existing-contact-wrong-phone-border');
}

function addPhoneFilter(inputId, errorMsgId, borderId) {
    const input = document.getElementById(inputId);
    const errorMsg = document.getElementById(errorMsgId);
    const border = document.getElementById(borderId);
    input.addEventListener('input', () => validatePhoneInput(input, errorMsg, border));
}

function validatePhoneInput(input, errorMsg, border) {
    const cleaned = input.value.replace(/[^0-9]/g, "");
    const invalid = cleaned !== input.value;
    input.value = cleaned;
    errorMsg.textContent = "Only digits are allowed";
    errorMsg.classList.toggle('visibility-hidden', !invalid);
    border.classList.toggle('error-message-border-bottom', invalid);
}

function editExistingContact(indexContact) {
    openExistingContactDialog(indexContact);
}

function openExistingContactDialog(indexContact) {
    const contact = allContacts[indexContact];
    const editContactDialog = document.getElementById("edit-contact-dialog");
    const badgeContainer = document.querySelector('.edit-badge-image-container');
    const initials = getInitials(contact.name).toUpperCase();
    badgeContainer.innerHTML = getEditBadgeTemplate(initials);
    badgeContainer.classList.add('profile-badge-large');
    setBadgeBackgroundColor();
    editIndex = indexContact;
    fillContactForm(contact);
    editContactDialog.showModal();
    editContactDialog.classList.add("slide-in");
    clickEventListener(editContactDialog, closeEditContactDialog);
}

function fillContactForm(contact) {
    document.getElementById('existing-contact-name').value = contact.name;
    document.getElementById('existing-contact-email').value = contact.email;
    document.getElementById('existing-contact-phone').value = contact.phone;
}

function closeEditContactDialog() {
    const editContactDialog = document.getElementById("edit-contact-dialog");
    editContactDialog.classList.remove("slide-in");
    setTimeout(() => {
        editContactDialog.close();
    }, 500);
}

async function saveEditedContact() {
    const contact = allContacts[editIndex];
    const ownId = contact.id;
    const oldName = contact.name;
    if (await contactHasValidationErrors(contact, ownId)) return;
    assignValuesToContact(contact);
    if (editContactHasBlankFields(contact)) return;
    allContacts[editIndex] = contact;
    if (oldName !== contact.name) {
        await renameContactFromTaskCard(oldName, contact.name);
    }
    await patchData('contacts/' + ownId, contact);
    closeEditContactDialog();
    updateEditedContact();
}

async function contactHasValidationErrors(contact, ownId) {
    const nameExists = await checkIfContactNameExists(contact.name, ownId, 'existing-contact-name-err-msg', 'existing-contact-wrong-name-border');
    const emailExists = await checkIfEmailExists(contact.email, ownId, 'existing-contact-email-err-msg', 'existing-contact-wrong-email-border');
    const phoneExists = await checkIfPhoneNumberExists(contact.phone, ownId, 'existing-contact-phone-err-msg', 'existing-contact-wrong-phone-border');
    return nameExists || emailExists || phoneExists;
}

function assignValuesToContact(contact) {
    const INPUT_NAME = document.getElementById('existing-contact-name').value.trim();
    const INPUT_EMAIL = document.getElementById('existing-contact-email').value.trim();
    const INPUT_PHONE_NUMBER = document.getElementById('existing-contact-phone').value.trim();
    contact.name = INPUT_NAME;
    contact.email = INPUT_EMAIL;
    contact.phone = INPUT_PHONE_NUMBER;
}

function editContactHasBlankFields(contact) {
    const editBlankName = fieldIsBlankFeedback(contact.name, 'existing-contact-name-err-msg', 'existing-contact-wrong-name-border', enterNameMsg);
    const editBlankEmail = fieldIsBlankFeedback(contact.email, 'existing-contact-email-err-msg', 'existing-contact-wrong-email-border', enterEmailMsg);
    const editBlankPhone = fieldIsBlankFeedback(contact.phone, 'existing-contact-phone-err-msg', 'existing-contact-wrong-phone-border', enterPhoneMsg);
    return editBlankName || editBlankEmail || editBlankPhone;
}

function updateEditedContact() {
    document.getElementById("contact-card" + editIndex).innerHTML = getContactCardContentTemplate(editIndex);
    showContactDetail(editIndex);
}

async function deleteContact(indexContact) {
    const contact = allContacts[indexContact];
    if (!contact) return;
    await deleteData('contacts/' + contact.id);
    await removeContactFromTaskCard(contact.name);
    if (currentlyOpenedCard) hideContactDetail();
    removeContactCard(indexContact, contact);
    showSuccessPopup('Contact successfully deleted');
}

function removeContactCard(indexContact, contactToRemove) {
    const firstLetter = contactToRemove.name.charAt(0).toUpperCase();
    const contactCard = document.getElementById("contact-card" + indexContact);
    const sameInitialContacts = allContacts.filter((contact) => contact.name.charAt(0).toUpperCase() === firstLetter);
    if (sameInitialContacts.length === 1) {
        document.querySelectorAll('[data-letter="' + firstLetter + '"]').forEach((element) => element.remove());
    }
    contactCard.remove();
}

async function renameContactFromTaskCard(oldName, newName) {
    const tasks = await getData('tasks');
    if (!tasks) return;
    for (const [id, task] of Object.entries(tasks)) {
        if (!task.assignedContacts?.includes(oldName)) continue;
        const renamed = task.assignedContacts.map(name => name === oldName ? newName : name);
        await patchData('tasks/' + id, { assignedContacts: renamed });
    }
}

async function removeContactFromTaskCard(contactName) {
    const tasks = await getData('tasks');
    if (!tasks) return;
    for (const [id, task] of Object.entries(tasks)) {
        if (!task.assignedContacts?.includes(contactName)) continue;
        await patchData('tasks/' + id, { assignedContacts: getRemainingContacts(task, contactName) });
    }
}

function getRemainingContacts(task, contactName) {
    return task.assignedContacts.filter((name) => name !== contactName);
}