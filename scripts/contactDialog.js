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

function submitHandler(event) {
    event.preventDefault();
    submitContactForm(event);
}

function closeDialogHandler(event, closingFunction) {
    event.preventDefault();
    editIndex = null;
    closingFunction();
}

/* ---------- Add contact dialog ---------- */

function getAddContactDialog() {
    return document.getElementById("add-contact-dialog");
}

function openContactDialog(i = null) {
    if (i === null) {
        resetBadge();
        document.getElementById('contact-form').reset();
    }
    activateDialog();
}

function activateDialog() {
    const dialog = getAddContactDialog();
    dialog.showModal();
    dialog.classList.add('slide-in');
    clickEventListener(dialog, closeContactDialog);
}

function closeContactDialog() {
    const contactDialog = getAddContactDialog();
    const contactForm = document.getElementById('contact-form');
    contactDialog.classList.remove("slide-in");
    setTimeout(() => {
        contactDialog.close();
    }, 500);
    resetBadge();
    resetContactForm();
    contactForm.reset();
}

function resetBadge() {
    const badge = document.querySelector('.badge-image-container');
    badge.style = "";
    badge.classList.remove('profile-badge-large');
    badge.innerHTML = '<img src="../assets/icons/person.svg" alt="person icon">';
}

function resetContactForm() {
    const border = document.querySelectorAll('.add-contact-content');
    border.forEach(borderColor => {
        borderColor.classList.remove('error-message-border-bottom');
    });
    const errMsg = document.querySelectorAll('.error-msg');
    errMsg.forEach(errorMessage => {
        errorMessage.classList.add('visibility-hidden');
    });
}

/* ---------- Submit (add / edit) ---------- */

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

async function addNewContact() {
    const contact = getContactFormfromForm();
    if (contactHasBlankFields(contact)) return;
    const nameExists = await checkIfContactNameExists(contact.name);
    const emailExists = await checkIfEmailExists(contact.email);
    const phoneExists = await checkIfPhoneNumberExists(contact.phone);
    if (nameExists || emailExists || phoneExists) return;
    await postData('contacts', contact);
    closeContactDialog();
    await renderContacts();
    showSuccessPopup('Contact successfully created');
}

function getContactFormfromForm() {
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };
}

function clearAddContactDialog() {
    const form = document.getElementById('add-task-form');
    form.reset();
}

/* ---------- Validation ---------- */

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

/* ---------- Input listeners ---------- */

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

/* ---------- Edit contact dialog ---------- */

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
    await updateEditedContact();
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

async function updateEditedContact() {
    await renderContacts();
    showContactDetail(editIndex);
}

/* ---------- Delete contact ---------- */

async function deleteContact(i) {
    const contact = allContacts[i];
    if (!contact) return;
    await deleteData('contacts/' + contact.id);
    await removeContactFromTaskCard(contact.name);
    if (currentlyOpenedCard) hideContactDetail()
    closeContactDialog();
    closeEditContactDialog();
    await renderContacts();
    showSuccessPopup('Contact successfully deleted');
}

/* ---------- Task sync (rename / remove contact) ---------- */

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
