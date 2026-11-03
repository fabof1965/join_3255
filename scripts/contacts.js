const isMobile = window.matchMedia("(max-width: 950px)").matches;

let allContacts = [];
let editIndex = null;
let isPreviouslyOpenedCard = false;
let currentlyOpenedCard = null;

document.addEventListener("DOMContentLoaded", initContacts);

document.getElementById("open-button").addEventListener("click", () => {
    if ((isMobile && !isPreviouslyOpenedCard) || !isMobile) {
        openContactDialog();
        document.getElementById("open-button").setAttribute("popovertarget", "");
        return;
    }
    if (isMobile && isPreviouslyOpenedCard) {
        setTimeout(() => showPopover(), 100);
    }
});

function initContacts() {
    renderContacts();
}

/**
 * renders all Contacts, grouped by initial letter, into the contact list.
 */
async function renderContacts() {
    allContacts = await loadContacts();
    const contactContainer = document.getElementById("contacts");
    contactContainer.innerHTML = "";
    sortContactsByName(allContacts);
    contactContainer.innerHTML = getContactsHtml();
    setBadgeBackgroundColor();
}

/**
 *  Builds the contact list HTML and adds a letter heading before each new initial.
 */
function getContactsHtml() {
    let previousLetter = "";
    return allContacts.map((contact, index) => {
        const letter = contact.name.charAt(0).toUpperCase();
        const heading = letter === previousLetter ? "" : getFirstLetterTemplate(letter);
        previousLetter = letter;
        return heading + getContactTemplate(index);
    }).join("");
}

/**
 * Loads the contacts from Firebase.
 */

async function loadContacts() {
    const response = await getData('contacts');
    if (!response) return [];
    return Object.entries(response).map(([id, contact]) => ({ id, ...contact }));
}

function toggleContactDetail(indexContact, contactCard) {
    if (isPreviouslyOpenedCard && contactCard === currentlyOpenedCard) {
        currentlyOpenedCard.classList.remove("background-primary");
        hidePreviouslyOpenedDetail(contactCard);
        return;
    }
    clearActiveContacts();
    showSelectedContact(indexContact, contactCard);
}

/**
 * Opens a contact card when activated with the keyboard.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {number} indexContact - The contact index.
 * @param {HTMLElement} contactCard - The activated contact card.
 */
function handleContactCardKeydown(event, indexContact, contactCard) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleContactDetail(indexContact, contactCard);
}

/**
 * Highlights the selected contact card and displays its contact information.
 * @param {number} indexContact - Index of the contact in allContacts.
 * @param {HTMLElement} contactCard - The clicked contact card element.
 */
function showSelectedContact(indexContact, contactCard) {
    contactCard.classList.add("background-primary");
    setTimeout(() => {
        showContactDetail(indexContact);
        setButtonContent();
    }, 250);
    isPreviouslyOpenedCard = true;
    currentlyOpenedCard = contactCard;
    if (isMobile) {
        document.getElementById("popover-menu").innerHTML = getPopoverContent(indexContact);
    }
}

/**
 * Shows the details of the selected contact with a slide-in animation.
 * @param {number} indexContact - Index of the contact in allContacts.
 */
function showContactDetail(indexContact) {
    getContactsData(indexContact);
    document.querySelector("#contact-detail").classList.add('animation-right');
    setBadgeBackgroundColor();
}

/**
 * Renders the information of the given contact into the contact detail container.
 * @param {number} indexContact - Index of the contact in allContacts.
 */
function getContactsData(indexContact) {
    const CONTACT_DETAIL_CONTAINER = document.getElementById('contact-detail');
    CONTACT_DETAIL_CONTAINER.innerHTML = getContactInformationTemplate(indexContact);
}

/**
 * Removes the highlight from all active contact cards and hides the contact detail.
 */
function clearActiveContacts() {
    const activeContacts = document.querySelectorAll('.background-primary');
    activeContacts.forEach(contactCard => {
        hidePreviouslyOpenedDetail(contactCard);
        contactCard.classList.remove('background-primary');
    });
}

/**
 * Removes the highlight from the given contact card and hides the contact detail.
 * @param {HTMLElement} contactCard - The contact card whose highlight and detail view are removed.
 */
function hidePreviouslyOpenedDetail(contactCard) {
    contactCard.classList.remove("background-primary");
    hideContactDetail();
}

/**
 * Hides the contact detail, removes highlight from the currently opened card. 
 * and resets the opened-card state.
 */
function hideContactDetail() {
    const detail = document.getElementById('contact-detail');
    if (detail) detail.classList.remove('animation-right');
    currentlyOpenedCard.classList.remove("background-primary");
    isPreviouslyOpenedCard = false;
    currentlyOpenedCard = null;
    setButtonContent();
}

/**
 * opens the popover menu of the selected contact (mobile view)
 */
function showPopover() {
    document.getElementById("popover-menu").showPopover();
}

/**
 * Toggles the add contact button icon between the default icon and the menu icon.
 * Only has an effect on mobile devices.
 * @param {string} defaultSource - Path to the default icon.  
 * @param {string} newSource - Path to the icon for the mobile view.
 */
function setButtonContent(defaultSource = "../assets/icons/new_contact.svg", newSource = "../assets/icons/menu.svg") {
    const addContactImage = document.querySelector(".add-new-contact-image");
    if (addContactImage.getAttribute("src") === defaultSource && isMobile) {
        addContactImage.setAttribute("src", newSource);
    }
    else if (addContactImage.getAttribute("src") === newSource && isMobile) {
        addContactImage.setAttribute("src", defaultSource);
    }
}