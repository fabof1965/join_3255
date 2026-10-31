const colorContacts = [
    "#E65100", // Orange
    "#8E24AA", // Violett
    "#D32F2F", // Rot
    "#B8860B", // Dunkles Gold
    "#0288D1", // Hellblau
    "#2E7D32", // Grün
    "#1A237E", // Dunkelblau
    "#00796B", // Petrol
    "#5D4037", // Braun
    "#455A64", // Blaugrau
    "#C2185B", // Pink
    "#558B2F", // Olivgrün
    "#A0522D", // Siena (rötliches Braun)
    "#00838F", // Cyan-Türkis
    "#6A1B9A", // Dunkellila
];

/**
 * Renders the shared sidebar template when its container exists.
 * @returns {void}
 */
function renderSidebar() {
    const sidebarContainer = document.getElementById("sidebar");

    if (!sidebarContainer) return;

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

    headerContainer.innerHTML = getHeaderTemplate();
    initHeaderProfile();
}

document.addEventListener("DOMContentLoaded", function () {
    authGuard()
    renderSidebar();
    renderHeader();
    // initHeaderProfile();
});

function toHelpPage() {
    window.location.href = "../pages/help.html";
}

function clickEventListener(dialog, closingFunction = null) {
    dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const RECT = dialog.getBoundingClientRect();
        if (
            event.clientX < RECT.left ||
            event.clientX > RECT.right ||
            event.clientY < RECT.top ||
            event.clientY > RECT.bottom
        ) {
            if (closingFunction !== null) {
                closingFunction();
                return;
            }
            dialog.close();
        }
    });
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
        profileBadgeElement.innerText = getInitials(userName);
    }
}

function getInitials(firstAndLastName) {
    const namePart = firstAndLastName.split(" ");
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

function authGuard() {
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