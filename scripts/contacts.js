function isMobile() {
    return window.matchMedia("(max-width: 950px)").matches;
}

let allContacts = [];
let editIndex = null;
let isPreviouslyOpenedCard = false;
let currentlyOpenedCard = null;

document.addEventListener("DOMContentLoaded", initContacts);

document.getElementById("open-button").addEventListener("click", () => {
    if ((isMobile() && !isPreviouslyOpenedCard) || !isMobile()) {
        openContactDialog();
        document.getElementById("open-button").setAttribute("popovertarget", "");
        return;
    }
    if (isMobile() && isPreviouslyOpenedCard) {
        setTimeout(() => showPopover(), 100);
    }
});

window.matchMedia("(max-width: 950px)").addEventListener("change", handleViewportChange);

/**
 * @description Updates the add contact button and the popover menu when the viewport
 * switches between mobile and desktop layout (e.g. when resizing the window).
 */
function handleViewportChange() {
    setButtonContent();
    if (currentlyOpenedCard) renderPopoverMenu(currentlyOpenedCard.dataset.contactIndex);
}

/**
 * @description Initializes the contacts page: loads contact-data, renders all contact cards
 * and sets the ARIA label on the add contact button.
 */
async function initContacts() {
    allContacts = await loadContacts();
    sortAllContactsByName();
    renderContacts();
    initAllContactCardListeners();
    initAddContactButtonAriaLabel();
}

/**
 * @description Initializes the ARIA label of the button that opens the dialog for adding a new contact on mobile devices.
 */
function initAddContactButtonAriaLabel() {
    const btnOpenContactDialog = document.getElementById("open-button");
    if(isMobile()) btnOpenContactDialog.setAttribute("aria-label", "Open Dialog to add a new contact");
}

/**
 * @description renders all Contact Cards into the contact list.
 */
function renderContacts() {
    const contactContainer = document.getElementById("contacts");
    contactContainer.innerHTML = getContactsHtml();
    setBadgeBackgroundColor();
}

/**
 * @description Initializes eventListeners on each HTML-Element with including
 * class 'contact-card'.
 */
function initAllContactCardListeners() {
    document.querySelectorAll('.contact-card').forEach((card) => {
        initContactCardListeners(card);
    });
}

/**
 * @description Sorts contact-data alphabetically by full name.
 */
function sortAllContactsByName() {
    allContacts.sort((contactA, contactB) => {
        const nameA = contactA.name.toUpperCase();
        const nameB = contactB.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

/**
 * @description Adds click and Enter-key listeners to a contact card
 * that toggle the display of its contact details.
 * @param {HTMLElement} card - The contact card element.
 */
function initContactCardListeners(card) {
    const contactCardIndex = card.dataset.contactIndex;
    card.addEventListener("click", () => {
        toggleContactDetail(contactCardIndex, card);
    });
    card.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            toggleContactDetail(contactCardIndex, card);
        }
    });
}

/**
 * @description Builds the contact list HTML and adds a letter heading before each new initial.
 */
function getContactsHtml(contacts = allContacts) {
    let contactsHTML = "";
    let previousLetter = "";
    for(let indexContact = 0; indexContact < contacts.length; indexContact++) {
        const letter = allContacts[indexContact].name.charAt(0).toUpperCase();
        if(letter !== previousLetter) {
            contactsHTML += getFirstLetterTemplate(letter);
            previousLetter = letter;
        }
        contactsHTML += getContactCardTemplate(indexContact);
    }
    return contactsHTML;
}

/**
 * @description Loads the contacts from Firebase.
 */
async function loadContacts() {
    const response = await getData('contacts');
    if (!response) return [];
    return Object.entries(response).map(([id, contact]) => ({ id, ...contact }));
}

/**
 * @description Toggles the detail view of a contact card.
 * @param {number} indexContact - The contact index.
 * @param {HTMLElement} contactCard - The activated contact card.
 */
function toggleContactDetail(indexContact, contactCard) {
    if(isPreviouslyOpenedCard && contactCard === currentlyOpenedCard) {
        hidePreviouslyOpenedDetail(contactCard);
        return;
    }
    clearActiveContacts();
    showSelectedContact(indexContact, contactCard);
}

/**
 * @description Opens a contact card when activated with the keyboard.
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
 * @description Highlights the selected contact card and displays its contact information.
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
    if (isMobile()) renderPopoverMenu(indexContact);
}

/**
 * @description Renders the edit and delete buttons into the popover menu (mobile view)
 * and attaches their event listeners.
 * @param {number} indexContact - Index of the contact in allContacts.
 */
function renderPopoverMenu(indexContact) {
    const popover = document.getElementById("popover-menu");
    popover.innerHTML = getPopoverContent(indexContact);
    editEventlistener(indexContact, popover);
    deleteEventListener(indexContact, popover);
}

/**
 * @description Removes the highlight from all active contact cards and hides the contact detail.
 */
function clearActiveContacts() {
    const activeContacts = document.querySelectorAll('.background-primary');
    activeContacts.forEach(contactCard => {
        hidePreviouslyOpenedDetail(contactCard);
        contactCard.classList.remove('background-primary');
    });
}

/**
 * @description Adds a click listener to the arrow button that hides the contact details
 * and returns to the contact list.
 */
function hideContactDetailOnArrowButtonClick() {
    document.querySelector("#arrow-btn").addEventListener("click", () => {
        hidePreviouslyOpenedDetail(currentlyOpenedCard);
    });
}

/**
 * @description Shows details for a selected contact card with a slide-in animation.
 * Sets the badge color and enables the arrow button on mobile to return to the contact list.
 * @param {number} indexContact - Index of the contact in allContacts.
 */
function showContactDetail(indexContact) {
    const detail = document.querySelector("#contact-detail");
    writeContactDataIntoDetailView(indexContact);
    detail.classList.add('animation-right');
    setBadgeBackgroundColor();
    hideContactDetailOnArrowButtonClick();
    editEventlistener(indexContact, detail);
    deleteEventListener(indexContact, detail);
    document.querySelector('[data-contact-index="' + indexContact + '"]').setAttribute("aria-label", "Close currently opened contact detail.");
}

/**
 * @description Adds a click event listener to the edit button that opens the edit dialog for the selected contact.
 * @param {number} indexContact - Index of the contact to edit.
 * @param {HTMLElement} container - Element that contains the edit button.
 */
function editEventlistener(indexContact, container) {
    container.querySelector(".edit").addEventListener("click", () => editExistingContact(indexContact));
}

/**
 * @description Adds a click eventlistener to the delete button that deletes the selected contact.
 * @param {number} indexContact - Index of the contact to delete.
 * @param {HTMLElement} container - Element that contains the delete button.
 */
function deleteEventListener(indexContact, container) {
    container.querySelector(".delete").addEventListener("click", () => deleteContact(indexContact));
}

/**
 * @description Renders the information of the given contact into the contact detail container.
 * @param {number} indexContact - Index of the contact in allContacts.
 */
function writeContactDataIntoDetailView(indexContact) {
    const CONTACT_DETAIL_CONTAINER = document.getElementById('contact-detail');
    CONTACT_DETAIL_CONTAINER.innerHTML = getContactInformationTemplate(indexContact);
}

/**
 * @description Removes the highlight from the given contact card and hides the contact detail.
 * @param {HTMLElement} contactCard - The contact card whose highlight and detail view are removed.
 */
function hidePreviouslyOpenedDetail(contactCard) {
    const contactIndex = contactCard.dataset.contactIndex;
    const ariaLabel = "Open contact " + allContacts[contactIndex].name;
    contactCard.setAttribute("aria-label", ariaLabel);
    contactCard.classList.remove("background-primary");
    hideContactDetail();
}

/**
 * @description Hides the contact detail, removes highlight from the currently opened card
 * and resets the opened-card state.
 */
function hideContactDetail() {
    const detail = document.getElementById('contact-detail');
    if (detail) detail.classList.remove('animation-right');
    isPreviouslyOpenedCard = false;
    currentlyOpenedCard = null;
    setButtonContent();
}

/**
 * @description Opens the popover menu of the selected contact that enables the user
 *  to either edit or delete the contact
 *  that is currently opened (mobile view)
 */
function showPopover() {
    document.getElementById("popover-menu").showPopover();
}

/**
 * @description Sets the add contact button icon and aria-label depending on the viewport
 * and whether a contact is currently opened. On mobile with an opened contact the menu icon
 * is shown, otherwise the default icon.
 * @param {string} defaultSource - Path to the default icon.
 * @param {string} newSource - Path to the icon for the mobile view.
 */
function setButtonContent(defaultSource = "../assets/icons/new_contact.svg", newSource = "../assets/icons/menu.svg") {
    const openButton = document.getElementById("open-button");
    const addContactImage = document.querySelector(".add-new-contact-image");
    const showMenuIcon = isMobile() && isPreviouslyOpenedCard;
    addContactImage.setAttribute("src", showMenuIcon ? newSource : defaultSource);
    if (!isMobile()) {
        openButton.removeAttribute("aria-label");
        return;
    }
    openButton.setAttribute("aria-label", showMenuIcon
        ? "Open popover menu with options to edit or delete the currently opened contact"
        : "Open Dialog to add a new contact");
}
