let allContacts = [];

function initContacts() {
    renderContacts();
}

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

function getContactsData() {
    const contactData = "";

    return contactData;
}

function makeElementFromLetter(letter) {

}

function positionDialog(potition) {
    // hier wird der Dialog positioniert
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

function getContactFormfromForm() {
    return {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
    };
}

async function addNewContact(event) {
    event.preventDefault();
    let form = document.getElementById('contact-form');
    let contact = getContactFormfromForm();
    await postData('contacts', contact);

    form.reset();
    closeContactDialog();
    renderContacts();
}

async function renderContacts() { // die hier brauche ich
    allContacts = await loadContacts();
    const contactContainer = document.getElementById("contacts");
    contactContainer.innerHTML = "";
    sortContactsByName(allContacts);
    for (let i = 0; i < allContacts.length; i++) {
        contactContainer.innerHTML += getContactTemplate(i);
        
    }

    console.log(allContacts);

    // const contactData = getContactsData();
    // for(let indexContact = 0; indexContact < contactData.length; indexContact++) {
    // }
}

function sortContactsByName(contacts) {
    contacts.sort(function(a, b){

        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase(); 

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    })
}

async function loadContacts() {
    const response = await getData('contacts');
    if (!response) return [];
    return Object.entries(response).map(([id, contact]) => ({ id, ...contact }));
}

function renderProfileBadges(name) {
    const namePart = name.split(" ");
    const firstLetter = namePart.shift().charAt(0);
    const lastLetter = namePart.length > 0 ? namePart[namePart.length - 1].charAt(0) : "";
    return (firstLetter + lastLetter);
}

function editExistingContact() {
    setDynamicDialogElements(existingContactValues.title, "", "Delete", "Save");
    // hier muss noch die Edit eigentschaften eingefügt werden
    openContactDialog();
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