const BASE_URL = "https://join-3255-default-rtdb.europe-west1.firebasedatabase.app/";

let backToLogin = document.getElementById('arrow-back');
backToLogin.addEventListener("click", () => {
  window.location.href = "../index.html"
})

function renderSidebar() {
  const sidebarContainer = document.getElementById("sidebar");

  if (!sidebarContainer) {
    return;
  }

  sidebarContainer.innerHTML = sidebarTemplate;
}

renderSidebar();
