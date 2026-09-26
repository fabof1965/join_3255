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

/**
 * Renders the shared sidebar template when its container exists.
 * @returns {void}
 */
function renderSidebar() {
  const sidebarContainer = document.getElementById("sidebar");

  if (!sidebarContainer) {
    return;
  }

  sidebarContainer.innerHTML = sidebarTemplate;
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
    renderSidebar();
    renderHeader();
    initHeaderProfile();
});

function toHelpPage() {
    window.location.href = "../pages/help.html";
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
        profileBadgeElement.innerText = getInitials(userName);
    }
}

function getInitials(name) {
    let parts = name.trim().split(" ");

    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
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

async function getAssignedContacts() {
  const response = await getData('contacts');
  if (!response) return [];
  return Object.entries(response).map(([id, contact]) => ({ id, ...contact }));
}

async function renderAssignedContacts() {
  assignedContacts = await getAssignedContacts();
  const contactRef = document.getElementById('assigned-contacts');
  contactRef.innerHTML = assignedContacts
    .map(({ name }) =>
      fillTemplate(assignedContactOptionTemplate, { initials: getInitials(name), name }),
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
