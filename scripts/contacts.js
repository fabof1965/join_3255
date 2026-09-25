let allContacts = [];

const colorContacts = [
    "#FF7A00",
    "#9327FF",
    "#FF745E",
    "#FFC701",
    "#FFE62B",
    "#FF5EB3",
    "#00BEE8",
    "#FFA35E",
    "#0038FF",
    "#FF4646",
    "#6E52FF",
    "#1FD7C1",
    "#FC71FF",
    "#C3FF2B",
    "#FFBB2B",
];

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

function animateContactDetailContainer(i) {
    getContactsData(i);
}

function toggleBackgroundColor(element, i) {
    element.classList.toggle("background-primary");
    animateContactDetailContainer(i);
}

const contactData = [];

function getContactsData(i) {
    const CONTACT_DETAIL_CONTAINER = document.getElementById("contact-detail");
    CONTACT_DETAIL_CONTAINER.classList.toggle("animation-right");
    CONTACT_DETAIL_CONTAINER.innerHTML = getContactInformationTemplate(i);
    setBadgeBackgroundColor();
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
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };
}

async function addNewContact(event) {
    event.preventDefault();
    const form = document.getElementById('contact-form');
    const contact = getContactFormfromForm();
    const nameOk = await checkIfContactNameExists(contact.name);
    const emailOk = await checkIfEmailExists(contact.email);
    const phoneOk = await checkIfPhoneNumberExists(contact.phone);
    
    if (nameOk || emailOk || phoneOk) return;
    const { name: firebaseId } = await postData('contacts', contact);
    contact.id = firebaseId;
    form.reset();
    closeContactDialog();
    renderContacts();
}

async function renderContacts() { // die hier brauche ich
    allContacts = await loadContacts();
    const contactContainer = document.getElementById("contacts");
    contactContainer.innerHTML = "";
    sortContactsByName(allContacts);
    let previousLetter = "";
    for (let i = 0; i < allContacts.length; i++) {
        let currentLetter = allContacts[i].name.charAt(0).toUpperCase();

        if (currentLetter !== previousLetter) {
            contactContainer.innerHTML += getFirstLetterTemplate(currentLetter);
            previousLetter = currentLetter; // hier wird der Buchstabe gespeichert
        }
        contactContainer.innerHTML += getContactTemplate(i);
    }
    setBadgeBackgroundColor();
}

function sortContactsByName(contacts) {
    contacts.sort(function (a, b) {

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

// async function checkIfContactExists(newContact) {
//     const response = await getData('contacts');
//     return response
//         ? Object.values(response).some(contact =>
//             contact.email === newContact.email ||
//             contact.name === newContact.name ||
//             contact.phone === newContact.phone)
//         : false;
// }

async function checkIfContactNameExists(inputName) {
    const errorMsg = document.getElementById('name-err-msg');
    const border = document.getElementById('wrong-name-border');
    const response = await getData('contacts');
    const nameExists = response ? Object.values(response).some(contact => contact.name === inputName) : false;

    if (nameExists) {
        errorMsg.classList.remove('visibility-hidden');
        border.classList.add('error-message-border-bottom');
    } else {
        errorMsg.classList.add('visibility-hidden');
        border.classList.remove('error-message-border-bottom');
    }
    return nameExists;
}

async function checkIfEmailExists(inputMail) {
    const errorMsg = document.getElementById('email-err-msg');
    const border = document.getElementById('wrong-email-border');
    const response = await getData('contacts');
    const emailExists = response ? Object.values(response).some(contact => contact.email === inputMail) : false;

    if (emailExists) {
        errorMsg.classList.remove('visibility-hidden');
        border.classList.add('error-message-border-bottom');
    } else {
        errorMsg.classList.add('visibility-hidden');
        border.classList.remove('error-message-border-bottom');
    }
    return emailExists;
}

async function checkIfPhoneNumberExists(inputPhone) {
    const errorMsg = document.getElementById('phone-err-msg');
    const border = document.getElementById('wrong-phone-border');
    const response = await getData('contacts');
    const phoneExists = response ? Object.values(response).some(contact => contact.phone === inputPhone) : false;

    if (phoneExists) {
        errorMsg.classList.remove('visibility-hidden');
        border.classList.add('error-message-border-bottom');
    } else {
        errorMsg.classList.add('visibility-hidden');
        border.classList.remove('error-message-border-bottom');
    }
    return phoneExists;
}

function renderProfileBadges(initials) {
    const namePart = initials.split(" ");
    const firstLetter = namePart.shift().charAt(0);
    const lastLetter = namePart.length > 0 ? namePart[namePart.length - 1].charAt(0) : "";
    return (firstLetter + lastLetter);
}

function getBadgeColor(initials) {
    let charSum = 0;
    for (let i = 0; i < initials.length; i++) {
        charSum += initials.charCodeAt(i);
    }

    return colorContacts[charSum % colorContacts.length];
}

function setBadgeBackgroundColor() {
    const badges = document.querySelectorAll('.profile-badge, .profile-badge-large');
    badges.forEach(badge => {
        badge.style.backgroundColor = getBadgeColor(badge.textContent.trim());
    });
}

function editExistingContact(i) {
    setDynamicDialogElements(existingContactValues.title, "", "Delete", "Save");
    const badgeContainer = document.querySelector('.badge-image-container');
    const initials = renderProfileBadges(allContacts[i].name).toUpperCase();
    badgeContainer.innerHTML = `<span id="badge-text" class="profile-badge-text">${initials}</span>`;
    badgeContainer.classList.add('profile-badge-large');
    badgeContainer.style.backgroundColor = getBadgeColor(initials);
    const badgeTextFontSize = document.getElementById('badge-text');
    badgeTextFontSize.style.fontSize = "var(--large-font-size)";
    openContactDialog(i);
}

async function deleteContact(i) {
    let contactDetails = document.getElementById('contact-detail');
    const contact = allContacts[i];
    if (!contact) return;
    await deleteData('contacts/' + contact.id);
    contactDetails.innerHTML = "";
    renderContacts();
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

function resetContactForm() {
    const border = document.getElementById('wrong-name-border');
    const nameErrMsg = document.getElementById('name-err-msg');
    nameErrMsg.classList.add('visibility-hidden');
    border.classList.remove('error-message-border-bottom');
}

function closeContactDialog() {
    const contactDialog = document.getElementById("contact-dialog");
    const contactForm = document.getElementById('contact-form');

    contactDialog.close();
    resetContactForm();
    contactForm.reset();
}