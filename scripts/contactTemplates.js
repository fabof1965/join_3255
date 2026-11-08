const enterNameMsg = "Please enter your name.";
const nameExistsMsg = "This Name already exists.";
const enterEmailMsg = "Please enter your email.";
const emailExistsMsg = "That email already exists.";
const enterPhoneMsg = "Please enter your phonenumber.";
const phoneExistsMsg = "Please choose a different number.";

/**
 * Generates the HTML for the popover buttons (edit and delete) of a contact.
 * @param {number} indexContact -  Index of the selected contact in `allContacts`.
 * @returns {string} HTML string with the edit and delete buttons for the selected contact.
 */
function getPopoverContent(indexContact) {
  const contactName = allContacts[indexContact].name;
  return `
      <button class="edit" aria-label="Edit contact '${contactName}'">
        <img src="../assets/icons/edit.svg" alt="Edit contact">Edit
      </button>
      <button class="delete" aria-label="Delete contact '${contactName}'">
        <img src="../assets/icons/delete.svg" alt="Delete contact">Delete
      </button>
  `;
}

function getContactCardTemplate(indexContact) {
  const initialLetter = allContacts[indexContact].name.charAt(0).toUpperCase();
  const name = allContacts[indexContact].name;
  return `
      <article class="contact-card" data-name="${name}" data-initial-letter="${initialLetter}" id="contact-card${indexContact}" role="button" data-contact-index="${indexContact}" tabindex="0" aria-label="Open contact ${allContacts[indexContact].name}">
        ${getContactCardContentTemplate(indexContact)}
      </article>
  `;
}

function getContactCardContentTemplate(indexContact) {
  return `<div class="profile-badge">
            ${getInitials(allContacts[indexContact].name).toUpperCase()}
          </div>
          <div class="name-and-mail">
            <span class="name">${allContacts[indexContact].name}</span>
            <span class="mail">${allContacts[indexContact].email}</span>
          </div>`;
}

function getFirstLetterTemplate(firstLetter) {
  return `
      <div class="letter" data-letter="${firstLetter}" aria-label="${firstLetter}">${firstLetter}</div>
      <div class="seperator" data-letter="${firstLetter}"></div>
  `;
}

function getContactHeaderTemplate(contact, indexContact) {
  return `
      <header class="detail-header">
        <div class="header-content-1">
          <div class="profile-badge-large large-text">
            <span class="profile-badge-text" id="initials-detail">${getInitials(contact.name).toUpperCase()}</span>
          </div>
          <div class="name-edit-delete">
            <h2 class="name large-text" id="name-detail">${contact.name}</h2>
            <div class="edit-delete" id="edit-delete-detail">${getPopoverContent(indexContact)}</div>
          </div>
        </div>
        <div class="header-content-2">
          <div class="contact-info-headline-container">
            <h3 class="info-headline">
              <span>
                Contact Information
              </span>
            </h3>
            <button id="arrow-btn" class="arrow-btn" aria-label="Go back to contact list and hide contact details for '${contact.name}'">
              <img src="../assets/icons/arrow-left-line.png" alt="back-to-contacts">
            </button>
          </div>
        </div>
      </header>
  `;
}

function getContactBodyTemplate(contact) {
  return `
      <div class="contact-information">
        <section class="email">
          <h4>E-Mail</h4>
          <a id="mail-detail" class="email-text" href="mailto:${contact.email}" aria-label="Send mail to '${contact.email}'">${contact.email}</a>
        </section>
        <section class="phone">
          <h4>Phone</h4>
          <a class="phone-detail" id="phone-detail" href="tel:${contact.phone}" aria-label="Call '${contact.name}'">${contact.phone}</a>
        </section>
      </div>
  `;
}

function getContactInformationTemplate(indexContact) {
  const contact = allContacts[indexContact];
  return `
      ${getContactHeaderTemplate(contact, indexContact)}
      ${getContactBodyTemplate(contact)}
  `;
}

function getEditBadgeTemplate(initials) {
  return `
      <span id="badge-text" class="profile-badge-text" style="font-size: var(--large-font-size)">${initials}</span>
  `;
}
