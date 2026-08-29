const BASE_URL =
  "https://join-3255-default-rtdb.europe-west1.firebasedatabase.app/";

function renderSidebar() {
  const sidebarContainer = document.getElementById("sidebar");

  if (!sidebarContainer) {
    return;
  }

  sidebarContainer.innerHTML = sidebarTemplate;
}

renderSidebar();
