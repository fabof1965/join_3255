const COLOR_CONTACTS = [
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
    document.getElementById("logout-button").addEventListener("click", () => logoutUser());
}

document.addEventListener("DOMContentLoaded", function () {
    authGuard()
    renderSidebar();
    renderHeader();
});

/**
 * Navigates the user to the help page.
 * @returns {void}
 */
function toHelpPage() {
    window.location.href = "../pages/help.html";
}

/**
 * Adds a click event listener to a dialog element to handle outside clicks (backdrop clicks).
 * If a click occurs outside the dialog boundaries, it either executes a custom closing function or closes the dialog directly.
 *
 * @param {HTMLDialogElement} dialog - The dialog element to attach the click listener to.
 * @param {Function|null} [closingFunction=null] - Optional custom callback function to execute when clicking outside.
 * @returns {void}
 */
function closeDialogOnOutsideClick(dialog, closingFunction = null) {
    dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const RECT = dialog.getBoundingClientRect();
        if (event.clientX < RECT.left || event.clientX > RECT.right || event.clientY < RECT.top || event.clientY > RECT.bottom) {
            if (closingFunction !== null) {
                closingFunction();
                return;
            }
            dialog.close();
        }
    });
}

/**
 * @description Navigates to the help page.
 * @returns {void}
 */
function handleHelpButtonClick() {
    toHelpPage();
}

/**
 * @description Logs the current user out and returns to the login page.
 * @returns {void}
 */
function logoutUser() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "../index.html";
}

/**
 * @description Universal function for the header badge (splits names like Saeed Ghorbani -> SG).
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

/**
 * @description Splits the firstAndLastName parameter by ' ' (one empty character) and gets the initials of the given parameter out of it.
 * @param {string} firstAndLastName
 * @returns {string} The initials that the parameter firstAndLastName gives.
 */
function getInitials(firstAndLastName) {
    const namePart = firstAndLastName.split(" ");
    const firstLetter = namePart.shift().charAt(0).toUpperCase();
    const lastLetter = namePart.length > 0 ? namePart[namePart.length - 1].charAt(0).toUpperCase() : "";
    return (firstLetter + lastLetter);
}

/**
 * @description Calculates the character sum and returns the given color code.
 * @param {string} initials - The initials of the given name
 * @returns {string} The hexadecimal color code for the given badge color.
 */
function getBadgeColor(initials) {
    let charSum = 0;
    for (let i = 0; i < initials.length; i++) {
        charSum += initials.charCodeAt(i);
    }

    return COLOR_CONTACTS[charSum % COLOR_CONTACTS.length];
}

/**
 * @description Sets the background color to each element with the class 'profile-badge' and 'profile-badge.large'.
 */
function setBadgeBackgroundColor() {
    const badges = document.querySelectorAll('.profile-badge, .profile-badge-large');
    badges.forEach(badge => {
        badge.style.backgroundColor = getBadgeColor(badge.textContent.trim());
    });
}

/**
 * @description Sorts the contacts by their names in alphabetical order.
 * @param {Array<object>} contacts All given contacts from the contact list.
 */
function sortContactsByName(contacts) {
    contacts.sort(compareContactNames);
}

/**
 * @description Compares the given strings a and by by their occurence in the alphabet.
 * @param {string} a
 * @param {string} b
 * @returns {number} If a comes after b in the alphabet, the return value is a positive number value.
 * If b comes after a in the alphabet, the return value is a negative number value.
 */
function compareContactNames(a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}

/**
 * @description Checks if the current URL is not publicly accessible.
 * The page is accessible if a logged in user changed the page URL and comes back to his previously opened page or
 * the pages URL ends with '/index.html', '/privacy_policy_start.html', or '/legal_notice_start.html'.
 *
 * @returns {function redirectToLogin(void)} If the current page is not to be accessed publicly and
 * the local storage does not include an item with "name" the user is redirected to login.
 */
function authGuard() {
    const currentUrl = window.location.pathname;
    if (!isPublicPage(currentUrl) && !localStorage.getItem("name")) return redirectToLogin();
    setPageStylesAfterLogin();
}

/**
 * @description Checks if the given URL is from a public page.
 * The pulic pages URL's end with: '/index.html', '/privacy_policy_start.html', or '/legal_notice_start.html'.
 * @param {string} url The given page URL
 * @returns {boolean} True if the given URL includes one of the public pages URL's.
 * If the given URL does not include any of the given URL's it returns false.
 */
function isPublicPage(url) {
    const publicPage = url.endsWith("index.html") || url.endsWith("privacy_policy_start.html") || url.endsWith("legal_notice_start.html");
    return publicPage;
}

/**
 * @description Directs to login page
 */
function redirectToLogin() {
    window.location.href = "../index.html";
}