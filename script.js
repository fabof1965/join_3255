const BASE_URL =
  "https://join-3255-default-rtdb.europe-west1.firebasedatabase.app/";

let backToLogin = document.getElementById("arrow-back");

if (backToLogin) {
  backToLogin.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

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

renderSidebar();
renderHeader();
