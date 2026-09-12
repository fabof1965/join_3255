let allContacts = [];

const addContactValues = {
    title: "Add contact",
    subtitle: "Tasks are better with a team!",
};

const existingContactValues = {
    title: "Edit contact",
};

const displayAttributes = {
    show: "flex",
    hide: "none"
}

const testContacts = [
    {
        "id": 1,
        "first-name": "Anton",
        "last-name": "Mayer",
        "phone": "+49 1111 111 11 1",
        "email": "antom@gmail.com",

    },
    {
        "id": 2,
        "first-name": "Bernd",
        "last-name": "Schmidt",
        "phone": "+49 123 456789",
        "email": "bernd.schmidt@example.com"
    },
    {
        "id": 3,
        "first-name": "Max",
        "last-name": "Mustermann",
        "phone": "+49 987 654321",
        "email": "max.mustermann@example.com"
    }
];

function toggleBackgroundColor(element) {    
    element.classList.toggle("background-primary");
    animateContactDetailContainer();
}

function animateContactDetailContainer() {
    const CONTACT_DETAIL_CONTAINER = document.getElementById("contact-detail");
    
    CONTACT_DETAIL_CONTAINER.classList.toggle("animation-right");
}

function renderContacts() { // die hier brauche ich


    let contactContainer = document.getElementById("contacts");
    contactContainer.innerHTML = "";
    // let contactData = getContactsData();

    for (let i = 0; i < allContacts.length; i++) {
        contactContainer.innerHTML += fillTemplate(contactCardTemplate, {
            id: contact.id,
            initials: getInitials(contact.name),
            name: contact.name,
            email: contact.email,
            phone: phone.name,
        });

    }
}

// function getContactsData() {
//     const contactData = "";

//     return contactData;
// }

function makeElementFromLetter(letter) {

}

function positionDialog(potition) {

}

function setDialogElementText(elementID, text) {
    document.getElementById(elementID).innerHTML = text;
}

function setDialogHeadline(text) {
    setDialogElementText("dialog-headline", text);
}

function setDialogSubheading(text) {
    setDialogElementText("dialog-subheading", text);
}

function setCancelButtonText(text) {
    setDialogElementText("cancel-btn-text", text);
}

function setAcceptButtonText(text) {
    setDialogElementText("accept-btn-text", text);
}

function setDynamicDialogElements(dialogHeadlineText, dialogSubheadingText, cancelButtonText, acceptButtonText) {
    setDialogHeadline(dialogHeadlineText);
    setDialogSubheading(dialogSubheadingText);

    setCancelButtonText(cancelButtonText);
    setAcceptButtonText(acceptButtonText);
}

function openContactDialog() {
    openContactDialog();
}

/**
 * Opens the contact dialog in "add" mode with an empty form.
 * @returns {void}
 */
function openAddContactDialog() {
    setDynamicDialogElements(addContactValues.title, addContactValues.subtitle, "Cancel", "Create contact");

    document.getElementById('contact-form').reset();
    openContactDialog();
}

/**
 * Reads the values of the contact form.
 * @returns {Object} Contact data without id.
 */
function getContactFormfromForm() {
    return {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
    };
}

async function addNewContact(event) { // und diese hier
    event.preventDefault();
    let form = document.getElementById('contact-form');
    let contact = getContactFormfromForm();
    let response = await postData('contacts', contact);
    testContacts.push({ ...contact, id: response.name });

    form.reset();
    closeContactDialog();
    renderContacts();

    // console.log("New contact added.");
}

async function deleteContact() {
    // let id = allContacts[i].id; (muss noch geschrieben werden)
    //allContacts.splice(i, 1);
    // renderContacts();
    await deleteData("contacts/" + id);
}

function editExistingContact() {
    setDynamicDialogElements(existingContactValues.title, "", "Delete", "Save");

    openContactDialog();
}

function loadContact() {

}

function showContact() {

}

function getDialog() {
    return document.getElementById("contact-dialog");
}

function openContactDialog() {
    const contactDialog = getDialog();

    contactDialog.showModal();
}

function closeContactDialog() {
    const contactDialog = document.getElementById("contact-dialog");

    contactDialog.close();
}
