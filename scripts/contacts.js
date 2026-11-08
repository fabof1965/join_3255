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

/**
 * Initializes the contacts page: renders all contact cards and sets the ARIA labels.
 */
async function initContacts() {
    allContacts = await loadContacts();
    sortAllContactsByName();
    renderContacts();
    initAllContactCardListeners();
    initAriaLabels();
}

/**
 * Sets the ARIA label of the button that opens the dialog for adding a new contact.
 */
function initAriaLabels() {
    const btnOpenContactDialog = document.getElementById("open-button");
    if(isMobile) btnOpenContactDialog.setAttribute("aria-label", "Open Dialog to add a new contact");
}

/**
 * renders all Contacts, grouped by initial letter, into the contact list.
 */
function renderContacts() {
    const contactContainer = document.getElementById("contacts");
    contactContainer.innerHTML = getContactsHtml();
    setBadgeBackgroundColor();
}

function initAllContactCardListeners() {
    document.querySelectorAll('.contact-card').forEach((card) => {
        initContactCardListeners(card);
    });
}

/**
 * Sorts contacts alphabetically by full name.
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
 * Adds click and Enter-key listeners to a contact card
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
 *  Builds the contact list HTML and adds a letter heading before each new initial.
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
 * Loads the contacts from Firebase.
 */
async function loadContacts() {
    const response = await getData('contacts');
    if (!response) return [];
    return Object.entries(response).map(([id, contact]) => ({ id, ...contact }));
}

/**
 * Toggles the detail view of a contact card.
 * @param {number} indexContact - The contact index.
 * @param {HTMLElement} contactCard - The activated contact card.
 */
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
        editEventlistener(indexContact);
        deleteEventListener(indexContact);
    }
}

/**
 * Adds a click listener to the arrow button that hides the contact details
 * and returns to the contact list.
 */
function hideContactDetailOnArrowButtonClick() {
    document.querySelector("#arrow-btn").addEventListener("click", () => {
        hideContactDetail();
    });
}

/**
 * Shows details for a selected contact card with a slide-in animation.
 * Sets the badge color and enables the arrow button to return to the contact list.
 * @param {number} indexContact - Index of the contact in allContacts.
 */
function showContactDetail(indexContact) {
    writeContactDataIntoDetailView(indexContact);
    document.querySelector("#contact-detail").classList.add('animation-right');
    setBadgeBackgroundColor();
    if(isMobile) hideContactDetailOnArrowButtonClick();
    editEventlistener(indexContact);
    deleteEventListener(indexContact);
}

/**
 * Adds a click event listener to the edit button that opens the edit dialog for the selected contact.
 * @param {number} indexContact - Index of the contact to edit.
 */
function editEventlistener(indexContact) {
    document.querySelector(".edit").addEventListener("click", () => editExistingContact(indexContact));
}

/**
 * Adds a click eventlistener to the delete button that deletes the selected contact.
 * @param {number} indexContact - Index of the contact to delete.
 */
function deleteEventListener(indexContact) {
    document.querySelector(".delete").addEventListener("click", () => deleteContact(indexContact));
}

/**
 * Renders the information of the given contact into the contact detail container.
 * @param {number} indexContact - Index of the contact in allContacts.
 */
function writeContactDataIntoDetailView(indexContact) {
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
    setTimeout(() => detail.innerHTML = "", 250);   
}

/**
 * Opens the popover menu of the selected contact (mobile view)
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
    const openButton = document.getElementById("open-button");
    const addContactImage = document.querySelector(".add-new-contact-image");
    if (addContactImage.getAttribute("src") === defaultSource && isMobile) {
        addContactImage.setAttribute("src", newSource);
        openButton.setAttribute("aria-label", "Open popover menu with options to edit or delete the currently opened contact");
    }
    else if (addContactImage.getAttribute("src") === newSource && isMobile) {
        addContactImage.setAttribute("src", defaultSource);
        openButton.setAttribute("aria-label", "Open Dialog to add a new contact");
    }
}