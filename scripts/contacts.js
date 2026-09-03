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
        "first-name": "Anna",
        "last-name": "Schmidt",
        "phone": "+49 123 456789",
        "email": "anna.schmidt@example.com"
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

function addNewContact() {
    document.getElementById("dialog-headline").innerHTML = addContactValues.title;
    document.getElementById("dialog-subheading").innerHTML = addContactValues.subtitle;
    openContactDialog();

    //this function adds a new contact to the backend contact list
    console.log("New contact added.");
}

function editExistingContact() {
    document.getElementById("dialog-headline").innerHTML = existingContactValues.title;
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