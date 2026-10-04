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
    initHeaderMenu();
});

function toHelpPage() {
    window.location.href = "../pages/help.html";
}

/**
 * Initializes the help button behavior for the shared header.
 * @returns {void}
 */
function initHeaderMenu() {
    const helpButton = document.getElementById("help-button");
    const logoutButton = document.getElementById("logout-button");

    if (!helpButton) return;
    helpButton.addEventListener("click", handleHelpButtonClick);
    logoutButton.addEventListener("click", logoutUser);
    document.addEventListener("click", closeHeaderMenuOnOutsideClick);
}

/**
 * Opens the header menu on the help page or navigates to help otherwise.
 * @returns {void}
 */
function handleHelpButtonClick() {
    const headerMenu = document.getElementById("header-menu");

    if (window.location.pathname.endsWith("/help.html")) {
        headerMenu.classList.toggle("is-visible");
        return;
    }
    toHelpPage();
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
 * Closes the header menu when the user clicks outside the header.
 * @param {MouseEvent} event - The document click event.
 * @returns {void}
 */
function closeHeaderMenuOnOutsideClick(event) {
    const headerMenu = document.getElementById("header-menu");
    const helpButton = document.getElementById("help-button");

    if (!headerMenu.contains(event.target) && !helpButton.contains(event.target)) {
        headerMenu.classList.remove("is-visible");
    }
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
