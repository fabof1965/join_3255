function getPopoverContent(indexContact) {
  return `<button class="edit" onclick="editExistingContact(${indexContact})">
            <img src="../assets/icons/edit.svg" alt="Edit contact">Edit
          </button>
          <button class="delete" onclick="deleteContact(${indexContact})">
            <img src="../assets/icons/delete.svg" alt="Delete contact">Delete
          </button> `;
}

function getContactTemplate(indexContact) {
  return `
      <div class="contact-card" id="contact-card${indexContact}" role="button" tabindex="0" aria-label="Open contact ${allContacts[indexContact].name}" onclick="toggleContactDetail(${indexContact}, this)" onkeydown="handleContactCardKeydown(event, ${indexContact}, this)">
        <div class="profile-badge">${renderProfileBadges(allContacts[indexContact].name).toUpperCase()}</div>
        <div class="name-and-mail">
          <span class="name">${allContacts[indexContact].name}</span>
          <span class="mail">${allContacts[indexContact].email}</span>
        </div>
      </div>
  `;
}

function getFirstLetterTemplate(firstLetter) {
  return `
      <div class="letter">${firstLetter}</div>
      <div class="seperator"></div>
    `;
}

function getContactInformationTemplate(indexContact) {
  const contact = allContacts[indexContact];

  return `
      <header class="detail-header">
        <div class="header-content-1">
          <div class="profile-badge-large large-text">
            <span class="profile-badge-text" id="initials-detail">${renderProfileBadges(contact.name).toUpperCase()}</span>
          </div>
          <div class="name-edit-delete">
            <h2 class="name large-text" id="name-detail">${contact.name}</h2>
            <div class="edit-delete" id="edit-delete-detail">
              <button class="edit" onclick="editExistingContact(${indexContact})">
                <img src="../assets/icons/edit.svg" alt="Edit contact">Edit
              </button>
              <button onclick="deleteContact(${indexContact})" class="delete">
                <img src="../assets/icons/delete.svg" alt="Delete contact">Delete
              </button>    
            </div>
          </div>
        </div>
        <div class="header-content-2">
          <div class="contact-info-headline-container">
            <h3 class="info-headline">
              <span>Contact Information</span>
            </h3>
            <button onclick="hideContactDetail()" class="arrow-btn">
              <img src="../assets/icons/arrow-left-line.png" alt="back-to-contacts">
            </button>
          </div>
        </div>
      </header>
      <div class="contact-information">
        <section class="email">
          <h4>E-Mail</h4>
          <a id="mail-detail" class="email-text" href="mailto:${contact.email}">${contact.email}</a>
        </section>
        <section class="phone">
          <h4>Phone</h4>
          <a class="phone-detail" id="phone-detail" href="tel:${contact.phone}">${contact.phone}</a>
        </section>
      </div>
  `;
}

function getEditBadgeTemplate(initials) {
  return `
    <span id="badge-text" class="profile-badge-text" style="font-size: var(--large-font-size)">${initials}</span>
  `;
}
