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
    const sidebarLinks = document.querySelectorAll(
        '#sidebar a[href]:not([href=""])',
    );

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
    initImageUpload();
});

function toHelpPage() {
    window.location.href = "../pages/help.html";
}

/**
 * Universal function for the header badge (runs on every page and splits names like Saeed Ghorbani -> SG).
 * @returns {void}
 */
function initHeaderProfile() {
    let profileBadgeElement = document.getElementById("profile-badge");
    if (!profileBadgeElement) return;

    let userName =
        localStorage.getItem("name") || sessionStorage.getItem("name");

    // If no name is available OR it is a guest -> show "G"
    if (!userName || userName === "Guest") {
        profileBadgeElement.innerText = "G";
    } else {
        profileBadgeElement.innerText = getInitials(userName);
    }
}
function initHeaderProfile() {
    let profileBadgeElement = document.getElementById("profile-badge");
    if (!profileBadgeElement) return;

    let userName =
        localStorage.getItem("name") || sessionStorage.getItem("name");

    // If no name is available OR it is a guest -> show "G"
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

/**
 * Initializes the profile image upload functionality, checking for saved
 * images in localStorage and setting up the file input change listener.
 * @returns {void}
 */
function initImageUpload() {
    const imageUploadInput = document.getElementById("imageUpload");
    const profileBadge = document.getElementById("profile-badge");
    if (!imageUploadInput || !profileBadge) return;
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        applyProfileImage(savedImage);
    }

    imageUploadInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const base64Image = e.target.result;
                localStorage.setItem("profileImage", base64Image);
                applyProfileImage(base64Image);
            };

            reader.readAsDataURL(file);
        }
    });
}

/**
 * Applies a given profile image source as the background of the profile badge.
 * @param {string} imageSrc - The Base64 string or URL of the image to apply.
 * @returns {void}
 */
function applyProfileImage(imageSrc) {
    const profileBadge = document.getElementById("profile-badge");
    if (!profileBadge) return;

    profileBadge.style.backgroundImage = `url(${imageSrc})`;
    profileBadge.style.backgroundSize = "cover";
    profileBadge.style.backgroundPosition = "center";
    profileBadge.style.color = "transparent";

    updateProfileContainerState(true);
}

/**
 * Toggles the 'has-image' class on the profile container based on image presence.
 * @param {boolean} hasImage - Flag indicating whether an active profile image exists.
 * @returns {void}
 */
function updateProfileContainerState(hasImage) {
    const profileContainer = document.querySelector(".profile-container");
    if (!profileContainer) return;

    profileContainer.classList.toggle("has-image", hasImage);
}

/**
 * Removes the stored profile image, resets the badge to initials, and hides controls.
 * @returns {void}
 */
function removeProfileImage() {
    localStorage.removeItem("profileImage");
    const profileBadge = document.getElementById("profile-badge");

    if (profileBadge) {
        profileBadge.style.backgroundImage = "";
        profileBadge.style.color = "";
    }

    updateProfileContainerState(false);

    const removeBtn = document.getElementById("remove-profile-btn");
    const imageUploadInput = document.getElementById("imageUpload");
    if (removeBtn) removeBtn.style.display = "none";
    if (imageUploadInput) imageUploadInput.value = "";

    initHeaderProfile();
}
