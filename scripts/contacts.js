const DETAIL_TRANSITION_MS = 600;

let detailTimeout = null;
let allContacts = [];
let editIndex = null;

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
    initPhoneFilter();
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
    const wasActive = element.classList.contains('background-primary');
    clearActiveContacts();
    if (wasActive) {
        hideContactDetail();
        return;
    }
    element.classList.add('background-primary');
    animateContactDetailContainer(i);
}

function clearActiveContacts() {
    const activeContacts = document.querySelectorAll('.background-primary');
    activeContacts.forEach(active => {
        active.classList.remove('background-primary');
    });
}

function hideContactDetail() {
    removeDetailUnderlay();
    const detail = document.getElementById('contact-detail');
    detail.classList.remove('animation-right');
    detail.innerHTML = "";
}

function getContactsData(i) {
    const CONTACT_DETAIL_CONTAINER = document.getElementById('contact-detail');
    if (CONTACT_DETAIL_CONTAINER.classList.contains('animation-right')) {
        slideOverCurrentDetail(CONTACT_DETAIL_CONTAINER, i);
    } else {
        showContactDetail(CONTACT_DETAIL_CONTAINER, i);
    }
}

function slideOverCurrentDetail(container, i) {
    removeDetailUnderlay();
    const underlay = container.cloneNode(true);
    underlay.removeAttribute('id');
    underlay.classList.add('detail-underlay');
    underlay.style.transition = "none";
    container.before(underlay);
    container.style.transition = "none";
    container.classList.remove('animation-right');
    container.offsetWidth;
    container.style.transition = "";
    showContactDetail(container, i);
    detailTimeout = setTimeout(removeDetailUnderlay, DETAIL_TRANSITION_MS);
}

function removeDetailUnderlay() {
    clearTimeout(detailTimeout);
    document.querySelectorAll(".detail-underlay").forEach(underlay => underlay.remove());
}

function showContactDetail(container, i) {
    container.innerHTML = getContactInformationTemplate(i);
    container.classList.add('animation-right');
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
    console.log("addNewContact läuft");
    event.preventDefault();
    const form = document.getElementById('contact-form');
    const contact = getContactFormfromForm();
    const nameExists = await checkIfContactNameExists(contact.name);
    const emailExists = await checkIfEmailExists(contact.email);
    const phoneExists = await checkIfPhoneNumberExists(contact.phone);
    if (nameExists || emailExists || phoneExists) return;
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

async function checkIfContactNameExists(inputName, ownId = null) {
    const errorMsg = document.getElementById('name-err-msg');
    const border = document.getElementById('wrong-name-border');
    const response = await getData('contacts');
    const nameExists = response ? Object.entries(response).some(([id, contact]) => id !== ownId && contact.name === inputName) : false;

    if (nameExists) {
        errorMsg.classList.remove('visibility-hidden');
        border.classList.add('error-message-border-bottom');
    } else {
        errorMsg.classList.add('visibility-hidden');
        border.classList.remove('error-message-border-bottom');
    }
    return nameExists;
}

async function checkIfEmailExists(inputMail, ownId = null) {
    const errorMsg = document.getElementById('email-err-msg');
    const border = document.getElementById('wrong-email-border');
    const response = await getData('contacts');
    const emailExists = response ? Object.entries(response).some(([id, contact]) => id !== ownId && contact.email === inputMail) : false;

    if (emailExists) {
        errorMsg.classList.remove('visibility-hidden');
        border.classList.add('error-message-border-bottom');
    } else {
        errorMsg.classList.add('visibility-hidden');
        border.classList.remove('error-message-border-bottom');
    }
    return emailExists;
}

async function checkIfPhoneNumberExists(inputPhone, ownId = null) {
    const errorMsg = document.getElementById('phone-err-msg');
    const border = document.getElementById('wrong-phone-border');
    const response = await getData('contacts');
    const phoneExists = response ? Object.entries(response).some(([id, contact]) => id !== ownId && contact.phone === inputPhone) : false;

    errorMsg.textContent = 'Please choose a different number.';
    if (phoneExists) {
        errorMsg.classList.remove('visibility-hidden');
        border.classList.add('error-message-border-bottom');
    } else {
        errorMsg.classList.add('visibility-hidden');
        border.classList.remove('error-message-border-bottom');
    }
    return phoneExists;
}

function initPhoneFilter() {
    const phoneInput = document.getElementById('phone');
    const errorMsg = document.getElementById('phone-err-msg');
    const border = document.getElementById('wrong-phone-border');

    phoneInput.addEventListener('input', () => {
        const cleaned = phoneInput.value.replace(/[^0-9]/g, "");
        const hadInvalidChars = cleaned !== phoneInput.value;
        phoneInput.value = cleaned;

        errorMsg.textContent = "Only digits are allowed";
        errorMsg.classList.toggle('visibility-hidden', !hadInvalidChars);
        border.classList.toggle('error-message-border-bottom', hadInvalidChars);
    });
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
    badgeContainer.innerHTML = getEditBadgeTemplate(initials);
    badgeContainer.classList.add('profile-badge-large');
    setBadgeBackgroundColor();
    editIndex = i;
    fillContactForm(allContacts[i]);
    openContactDialog(i);
}

function fillContactForm(contact) {
    document.getElementById('name').value = contact.name;
    document.getElementById('email').value = contact.email;
    document.getElementById('phone').value = contact.phone;
}

async function saveEditedContact() {
    const contact = getContactFormfromForm();
    const ownId = allContacts[editIndex].id;
    const nameExists = await checkIfContactNameExists(contact.name, ownId);
    const emailExists = await checkIfEmailExists(contact.email, ownId);
    const phoneNumberExists = await checkIfPhoneNumberExists(contact.phone, ownId);

    if (nameExists || emailExists || phoneNumberExists) return;
    await patchData('contacts/' + ownId, contact);
    closeContactDialog();
    document.getElementById('contact-detail').innerHTML = "";
    renderContacts();
}

async function submitContactForm(event) {
    event.preventDefault();
    if (editIndex === null) {

        await addNewContact(event);
    } else {
        await saveEditedContact();
    }
}

async function deleteContact(i) {
    let contactDetails = document.getElementById('contact-detail');
    const contact = allContacts[i];
    if (!contact) return;
    await deleteData('contacts/' + contact.id);
    contactDetails.innerHTML = "";
    closeContactDialog();
    renderContacts();
}

function getDialog() {
    return document.getElementById("contact-dialog");
}

function resetBadge() {
    const badge = document.querySelector('.badge-image-container');
    badge.style = "";
    badge.classList.remove('profile-badge-large');
    badge.innerHTML = '<img src="../assets/icons/person.svg" alt="person icon">';
}

function openContactDialog(i = null) {
    if (i === null) {
        resetBadge();
        document.getElementById('contact-form').reset();
        setDynamicDialogElements(addContactValues.title, "Tasks are better with a team!", "Cancel", "Create contact");
        const badge = document.querySelector('.badge-image-container');
        badge.style = "";
        badge.classList.remove('profile-badge-large');
        badge.innerHTML = '<img src="../assets/icons/person.svg" alt="person icon">';
    } else {
        setDynamicDialogElements(existingContactValues.title, "", "Delete", "Save");
    }
    getDialog().showModal();
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

function closeContactDialog() {
    const contactDialog = document.getElementById("contact-dialog");
    const contactForm = document.getElementById('contact-form');

    contactDialog.close();
    resetBadge();
    resetContactForm();
    contactForm.reset();
}

getDialog().addEventListener("close", () => {
    editIndex = null;
    resetContactForm();
    document.getElementById('contact-form');
})