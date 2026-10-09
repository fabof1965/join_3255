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

let assignedContacts = [];
const dialogFocusTargets = new WeakMap();
const dialogCancelHandlers = new WeakMap();

/**
 * Opens a dialog and moves focus to its first useful control.
 * @param {HTMLDialogElement} dialog - Dialog to open.
 * @param {string} focusSelector - Selector for the initial focus target.
 * @returns {void}
 */
function openAccessibleDialog(dialog, focusSelector) {
  dialogFocusTargets.set(dialog, document.activeElement);
  const cancelHandler = createDialogCancelHandler(dialog);
  dialogCancelHandlers.set(dialog, cancelHandler);
  dialog.addEventListener("cancel", cancelHandler);
  dialog.showModal();
  dialog.querySelector(focusSelector)?.focus();
}

function createDialogCancelHandler(dialog) {
  return (event) => {
    event.preventDefault();
    dialog.classList.remove("slide-in");
    setTimeout(() => closeAccessibleDialog(dialog), 400);
  };
}

/**
 * Closes a dialog and restores focus to the element that opened it.
 * @param {HTMLDialogElement} dialog - Dialog to close.
 * @returns {void}
 */
function closeAccessibleDialog(dialog) {
  if (!dialog.open) return;
  dialog.close();
  dialog.removeEventListener("cancel", dialogCancelHandlers.get(dialog));
  dialogFocusTargets.get(dialog)?.focus();
  dialogFocusTargets.delete(dialog);
  dialogCancelHandlers.delete(dialog);
}

/**
 * Renders the shared sidebar template when its container exists.
 * @returns {void}
 */
function renderSidebar() {
  const sidebarContainer = document.getElementById("sidebar");
  const startClass = "start";
  
  if(!sidebarContainer) return;

  sidebarContainer.innerHTML = getSidebarTemplate();
  markActiveSidebarLink();
}

/**
 * Marks the sidebar link that belongs to the current page.
 * @returns {void}
 */
function markActiveSidebarLink() {
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('#sidebar a[href]:not([href=""])');

  sidebarLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    link.classList.toggle("active", linkPath === currentPath);
  });
}

/**
 * Renders the shared header template when its container exists.
 * @returns {void}
 */
function renderHeader() {
  const headerContainer = document.getElementById("header");

  if (!headerContainer) {
    return;
  }
  headerContainer.innerHTML = headerTemplate;
}

document.addEventListener("DOMContentLoaded", function () {
    checkUserLogin()
    renderSidebar();
    renderHeader();
    initHeaderProfile();
    initHeaderInteractions();
});

function toHelpPage() {
    window.location.href = "../pages/help.html";
}


/**
 * Opens the header menu on the help page or navigates to help otherwise.
 * @returns {void}
 */
function handleHelpButtonClick() {
    const headerMenu = document.getElementById("header-menu");

    if (window.location.pathname.endsWith("/help.html")) {
        toggleHeaderMenu();
        return;
    }
    toHelpPage();
}

/**
 * Toggles the visibility of the shared header menu.
 * @returns {void}
 */
function toggleHeaderMenu() {
    const headerMenu = document.getElementById("header-menu");
    if (!headerMenu) return;
    if (typeof headerMenu.togglePopover !== "function") {
        headerMenu.classList.toggle("is-visible");
        return;
    }
    headerMenu.togglePopover();
}

/**
 * Connects the shared header controls after the header is rendered.
 * @returns {void}
 */
function initHeaderInteractions() {
    const helpButton = document.getElementById("help-button");
    const logoutButton = document.getElementById("logout-button");
    if (helpButton) helpButton.addEventListener("click", handleHelpButtonClick);
    if (logoutButton) logoutButton.addEventListener("click", logoutUser);
    document.addEventListener("click", closeHeaderMenuOnOutsideClick);
}

/**
 * Closes the shared header menu when the user clicks outside it.
 * @param {MouseEvent} event - Document click event.
 * @returns {void}
 */
function closeHeaderMenuOnOutsideClick(event) {
    const headerMenu = document.getElementById("header-menu");
    const profileButton = document.getElementById("profile-button");
    const helpButton = document.getElementById("help-button");
    if (
        !headerMenu ||
        headerMenu.contains(event.target) ||
        profileButton?.contains(event.target) ||
        helpButton?.contains(event.target)
    ) return;
    closeHeaderMenu(headerMenu);
}

function closeHeaderMenu(headerMenu) {
    if (typeof headerMenu.hidePopover === "function" && headerMenu.matches(":popover-open")) {
        headerMenu.hidePopover();
        return;
    }
    headerMenu.classList.remove("is-visible");
}

/**
 * Logs the current user out and returns to the login page.
 * @returns {void}
 */
function logoutUser() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "../index.html";
}

/**
 * Universal function for the header badge (splits names like Saeed Ghorbani -> SG).
 */
function initHeaderProfile() {
    let profileBadgeElement = document.getElementById("profile-badge");
    if (!profileBadgeElement) return;

    let userName = localStorage.getItem("name") || sessionStorage.getItem("name");

    if (!userName || userName === "Guest") {
        profileBadgeElement.innerText = "G";
    } else {
        profileBadgeElement.innerText = renderProfileBadges(userName);
    }
}

function renderProfileBadges(initials) {
    const namePart = initials.split(" ");
    const firstLetter = namePart.shift().charAt(0).toUpperCase();
    const lastLetter = namePart.length > 0 ? namePart[namePart.length - 1].charAt(0).toUpperCase() : "";
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

function sortContactsByName(contacts) {
    contacts.sort(compareContactNames);
}

function compareContactNames(a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}

async function getAssignedContacts() {
  const response = await getData('contacts');
  if (!response) return [];
  return Object.entries(response).map(([id, contact]) => ({ id, ...contact }));
}

async function renderAssignedContacts(container) {
  assignedContacts = await getAssignedContacts();
  sortContactsByName(assignedContacts);
  const contactRef = container.querySelector('#assigned-contacts');
  contactRef.innerHTML = assignedContacts
    .map(({ name }) =>
      fillTemplate(assignedContactOptionTemplate, { initials: renderProfileBadges(name), name }),
    )
    .join("");
}

/**
 * Replaces every placeholder in an HTML template.
 * @param {string} template - HTML containing named placeholders.
 * @param {Object.<string, string|number>} values - Values for the placeholders.
 * @returns {string} Completed HTML.
 */
function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
    template,
  );
}

function checkUserLogin() {
    const currentUrl = window.location.pathname;
    if (shouldRedirectToLogin(currentUrl)) return redirectToLogin();
    showPageAfterLogin();
}

function shouldRedirectToLogin(url) {
    const publicPage = url.endsWith("index.html") || url.endsWith("privacy_policy_start.html") || url.endsWith("legal_notice_start.html");
    return !publicPage && !localStorage.getItem("name");
}

function redirectToLogin() {
    window.location.href = "../index.html";
}

function showPageAfterLogin() {
    setTimeout(() => { document.body.style.display = "flex"; document.body.style.flexDirection = "column"; }, 1);
}
