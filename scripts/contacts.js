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
    initAriaLabels();
    console.log(document.getElementsByName(".contact-card"));
}

function initAriaLabels() {
    const btnOpenContactDialog = document.getElementById("open-button");

    btnOpenContactDialog.setAttribute("aria-label", "Open Dialog to add a new contact");
}

/**
 * renders all Contacts, grouped by initial letter, into the contact list.
 */
async function renderContacts() {
    allContacts = await loadContacts();
    const contactContainer = document.getElementById("contacts");
    contactContainer.innerHTML = "";
    contactContainer.innerHTML = getContactsHtml();
    setBadgeBackgroundColor();
    document.querySelectorAll('.contact-card').forEach((card) => {
        const contactCardIndex = card.dataset.indexNumber;
        card.addEventListener("click", () => {
            toggleContactDetail(contactCardIndex, card);
        });
        card.addEventListener("keyup", (event) => {
            if(event.key === "Enter") {
                handleContactCardKeydown(event, contactCardIndex, card);
            }
        });
    });
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

function showContactDetail(indexContact) {
    getContactsData(indexContact);
    document.querySelector("#contact-detail").classList.add('animation-right');
    setBadgeBackgroundColor();
}

function getContactsData(indexContact) {
    const CONTACT_DETAIL_CONTAINER = document.getElementById('contact-detail');
    CONTACT_DETAIL_CONTAINER.innerHTML = getContactInformationTemplate(indexContact);
    document.querySelector("#arrow-btn").addEventListener("click", () => {
        hideContactDetail();
    });
}

function clearActiveContacts() {
    const activeContacts = document.querySelectorAll('.background-primary');
    activeContacts.forEach(contactCard => {
        hidePreviouslyOpenedDetail(contactCard);
        contactCard.classList.remove('background-primary');
    });
}

function hidePreviouslyOpenedDetail(contactCard) {
    contactCard.classList.remove("background-primary");
    hideContactDetail();
}

function hideContactDetail() {
    const detail = document.getElementById('contact-detail');
    if (detail) detail.classList.remove('animation-right');
    currentlyOpenedCard.classList.remove("background-primary");
    isPreviouslyOpenedCard = false;
    currentlyOpenedCard = null;
    setButtonContent();
    document.getElementById("open-button").setAttribute("aria-label", "Open Dialog to add a new contact"); 
}

function showPopover() {
    document.getElementById("popover-menu").showPopover();
}

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