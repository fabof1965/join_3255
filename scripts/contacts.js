const addContactValues = {
    title: "Add contact",
    subtitle: "Tasks are better with a team!",
};

const existingContactValues = {
    title: "Edit contact",
};

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

function renderContacts() {
    const contactContainer = document.getElementById("contacts");
    const contactData = getContactsData();

    for(let indexContact = 0; indexContact < contactData.length; indexContact++) {

    }
}

function getContactsData() {
    const contactData = "";

    return contactData; 
}

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

function addNewContact() {
    setDynamicDialogElements(addContactValues.title, addContactValues.subtitle, "Cancel", "Create contact");

    openContactDialog();

    //this function adds a new contact to the backend contact list
    console.log("New contact added.");
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