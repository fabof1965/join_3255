eventHandler();

/**
 * @description Handles all contact dialog events.
 */
function eventHandler() {
    handleClickEvents();
    handleSubmitEvent();
    handleCancelEvents();
}

/**
 * @description Handles the 'cancel' event for the Add Contact Dialog and the Edit Contact Dialog.
 */
function handleCancelEvents() {
    getAddContactDialog().addEventListener("cancel", (event) => {
        closeDialogHandler(event, closeContactDialog);
    });
    document.getElementById("edit-contact-dialog").addEventListener("cancel", (event) => {
        closeDialogHandler(event, closeEditContactDialog);
    });
}

/**
 * @description Handles the submit event that is fired by the contact form.
 */
function handleSubmitEvent() {
    document.addEventListener("submit", (event) => {
        if(event.target.closest(".contact-form")) {
            submitHandler(event);
        }
    });
}

/**
 * @description Handles 'click' events throughout contact-dialogs.
 */
function handleClickEvents() {
    document.addEventListener("click", (event) => {
        if(event.target.closest(".btn-close-add-contact-dialog")) {
            closeDialogHandler(event, closeContactDialog);
        }
        if(event.target.closest(".btn-close-edit-dialog")) {
            closeDialogHandler(event, closeEditContactDialog);
        }
    });
}

/**
 * @description Handles the contact form's submit.
 * @param {SubmitEvent} event
 */
function submitHandler(event) {
    event.preventDefault();
    submitContactForm(event);
}

/**
 * @description Handles the cancel event on the dialogs.
 * @param {Cancel} event
 * @param {calling function} closingFunction
 */
function closeDialogHandler(event, closingFunction) {
    event.preventDefault();
    editIndex = null;
    closingFunction();
}

/**
 * Gets the dialog element with the given id 'add-contact-dialog'.
 * @returns HTML Dialog element
 */
function getAddContactDialog() {
    return document.getElementById("add-contact-dialog");
}

/**
 * @description Opens the dialog that makes it possile to create a new contact.
 */
function openContactDialog() {
    const dialog = getAddContactDialog();
    dialog.showModal();
    dialog.classList.add('slide-in');
    closeDialogOnOutsideClick(dialog, closeContactDialog);
}

/**
 * @description Closes the 'Add Contact' - Dialog.
 */
function closeContactDialog() {
    const contactDialog = getAddContactDialog();
    const contactForm = document.getElementById('contact-form');
    contactDialog.classList.remove("slide-in");
    setTimeout(() => contactDialog.close(), 500);
    resetContactFormErrors();
    contactForm.reset();
}

/**
 * @description Submits Contact data to firebase.
 * @param {SubmitEvent} event
 * @returns {Promise<void>}
 */
async function submitContactForm(event) {
    event.preventDefault();
    if (editIndex === null) {
        await addNewContact();
        return;
    }
    await saveEditedContact();
}

/**
 * @description Inserts a new created contact into the contact list and
 * loads the data into the global allContacts Array as well as to firebase.
 * @returns {Promise<void>}
 */
async function addNewContact() {
    const contactList = document.getElementById("contacts");
    const contact = getContactDataFromForm();
    if (contactFormHasBlankFields(contact)) return;
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
 * @description Inserts a new contact element into the contact list.
 * @param {HTMLElement} contactList
 * @param {string} newContactName
 * @param {number} indexContact
 * @returns {void}
 */
function insertContact(contactList, newContactName, indexContact) {
    const initialLetter = newContactName.charAt(0).toUpperCase();
    const newContactElement = makeNewContactNode(indexContact);
    const initialLetterGroup = [...document.querySelectorAll(`[data-initial-letter="${initialLetter}"]`)];
    if (initialLetterGroup.length > 0) {
        insertContactIntoContactGroup(newContactName, newContactElement, initialLetterGroup);
        return;
    }
    appendContactListByNewElement(initialLetter, newContactElement, contactList);
}

/**
 * @description Sets the newContactElement to the correct place inside a contact group.
 * @param {string} newContactName
 * @param {Node} newContactElement
 * @param {Array<Node>} group
 */
function insertContactIntoContactGroup(newContactName, newContactElement, initialLetterGroup) {
    const nextElement = initialLetterGroup.find(contact => contact.dataset.name.localeCompare(newContactName, 'de') > 0);
    if (nextElement) nextElement.before(newContactElement);
    else initialLetterGroup.at(-1).after(newContactElement);
    setBadgeBackgroundColor();
    initContactCardListeners(newContactElement);
}

/**
 * @description Inserts the newContactElement to the correct position at the contact list.
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
 * @description Creates a new contact node element and sets all nesseccary attributes.
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
 * grouped by the initial letter of the contacts belonging to this group.
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
 * @description Creates a seperator element.
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
 * @description Retrieves the data from the input fields in the contact dialog.
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
 * @description Opens the Edit Contact Dialog.
 * @param {number} indexContact
 */
function editExistingContact(indexContact) {
    openExistingContactDialog(indexContact);
}

/**
 * @description Fills the edit contact dialog with contact data and opens the dialog.
 * @param {number} indexContact
 */
function openExistingContactDialog(indexContact) {
    const contact_Edit = allContacts[indexContact];
    const editContactDialog = document.getElementById("edit-contact-dialog");
    const badgeContainer = document.querySelector('.edit-badge-image-container');
    const initials = getInitials(contact_Edit.name).toUpperCase();
    badgeContainer.innerHTML = getEditBadgeTemplate(initials);
    badgeContainer.classList.add('profile-badge-large');
    setBadgeBackgroundColor();
    editIndex = indexContact;
    fillContactForm(contact_Edit);
    editContactDialog.showModal();
    editContactDialog.classList.add("slide-in");
    closeDialogOnOutsideClick(editContactDialog, closeEditContactDialog);
}

/**
 * @description Fills the fiels with following id's with contact-data:
 * 'existing-contact-name', 'existing-contact-email', 'existing-contact-phone'.
 * @param {object} contact
 */
function fillContactForm(contact) {
    document.getElementById('existing-contact-name').value = contact.name;
    document.getElementById('existing-contact-email').value = contact.email;
    document.getElementById('existing-contact-phone').value = contact.phone;
}

/**
 * Closes the edit Contact dialog.
 */
function closeEditContactDialog() {
    const editContactDialog = document.getElementById("edit-contact-dialog");
    editContactDialog.classList.remove("slide-in");
    setTimeout(() => {
        editContactDialog.close();
    }, 500);
}

/**
 * @description Overrides the contact data on firebase with the new contact Data that has been edited.
 * Also the name of a contact is updated in the contact card with the corresponding index.
 * @returns {Promise<void>}
 */
async function saveEditedContact() {
    const contact = allContacts[editIndex];
    const ownId = contact.id;
    const oldName = contact.name;
    if (await contactFormHasValidationErrors(contact, ownId)) return;
    assignValuesToContact(contact);
    if (contactFormHasBlankFields(contact)) return;
    allContacts[editIndex] = contact;
    if (oldName !== contact.name) {
        await renameContactFromTaskCard(oldName, contact.name);
    }
    await patchData('contacts/' + ownId, contact);
    closeEditContactDialog();
    updateEditedContact();
}

/**
 * @description Assigns values from the edit contact dialogs input fields to the gien contact object.
 * @param {object} contact
 */
function assignValuesToContact(contact) {
    const INPUT_NAME = document.getElementById('existing-contact-name').value.trim();
    const INPUT_EMAIL = document.getElementById('existing-contact-email').value.trim();
    const INPUT_PHONE_NUMBER = document.getElementById('existing-contact-phone').value.trim();
    contact.name = INPUT_NAME;
    contact.email = INPUT_EMAIL;
    contact.phone = INPUT_PHONE_NUMBER;
}

/**
 * @description Updates the contect data that is seen in the contact card as well as in the contact detail.
 */
function updateEditedContact() {
    document.getElementById("contact-card" + editIndex).innerHTML = getContactCardContentTemplate(editIndex);
    showContactDetail(editIndex);
}

/**
 * @description Deletes the contact with the given index from firebase, the contact list (visually) and from the allContacts array.
 * @param {number} indexContact
 * @returns {Promise<void>}
 */
async function deleteContact(indexContact) {
    const contact = allContacts[indexContact];
    if (!contact) return;
    await deleteData('contacts/' + contact.id);
    await removeContactFromTaskCard(contact.name);
    if (currentlyOpenedCard) hideContactDetail();
    removeContactCard(indexContact, contact);
    allContacts.splice(indexContact, 1);
    showSuccessPopup('Contact successfully deleted');
}

/**
 * @description Removes the contact card visually from the contact list.
 * @param {number} indexContact
 * @param {object} contactToRemove
 */
function removeContactCard(indexContact, contactToRemove) {
    const firstLetter = contactToRemove.name.charAt(0).toUpperCase();
    const contactCard = document.getElementById("contact-card" + indexContact);
    const sameInitialContacts = allContacts.filter((contact) => contact.name.charAt(0).toUpperCase() === firstLetter);
    if (sameInitialContacts.length === 1) {
        document.querySelectorAll('[data-letter="' + firstLetter + '"]').forEach((element) => element.remove());
    }
    contactCard.remove();
}

/**
 * @description Changes the name of a contact on task cards with this contact.
 * @param {string} oldName
 * @param {string} newName
 * @returns {Promise<void>}
 */
async function renameContactFromTaskCard(oldName, newName) {
    const tasks = await getData('tasks');
    if (!tasks) return;
    for (const [id, task] of Object.entries(tasks)) {
        if (!task.assignedContacts?.includes(oldName)) continue;
        const renamed = task.assignedContacts.map(name => name === oldName ? newName : name);
        await patchData('tasks/' + id, { assignedContacts: renamed });
    }
}

/**
 * @description Removes a contact from the task card.
 * @param {string} contactName
 * @returns {Promise<void>}
 */
async function removeContactFromTaskCard(contactName) {
    const tasks = await getData('tasks');
    if (!tasks) return;
    for (const [id, task] of Object.entries(tasks)) {
        if (!task.assignedContacts?.includes(contactName)) continue;
        await patchData('tasks/' + id, { assignedContacts: getRemainingContacts(task, contactName) });
    }
}

/**
 * @description Gets all contacts excluding the given contactName.
 * @param {object} task
 * @param {string} contactName
 * @returns {Array<string>}
 */
function getRemainingContacts(task, contactName) {
    return task.assignedContacts.filter((name) => name !== contactName);
}