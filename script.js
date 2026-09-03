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
  markActiveSidebarLink();
}

/**
 * Marks the sidebar link that belongs to the current page.
 * @returns {void}
 */
function markActiveSidebarLink() {
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.sidebar a[href]:not([href=""])');

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

renderSidebar();
renderHeader();

function resetPasswordIconIfEmpty() {
  let toggleIcon = document.getElementById('password-toggle-icon');
  if (password.value === "") {
    password.type = "password";
    toggleIcon.src = "../assets/icons/lock.svg";
    toggleIcon.alt = "lock-img";
  }
}

let passwordInput = document.getElementById('password');
if (passwordInput) {
  passwordInput.addEventListener('input', resetPasswordIconIfEmpty);
}

function toggleShowPassword() {
  let toggleIcon = document.getElementById('password-toggle-icon');
  if (password.value === "") {
    return;
  }
  if (password.type === "password") {
    password.type = "text";
    toggleIcon.src = '../assets/icons/visibility.svg';
    toggleIcon.alt = "show password";
  } else {
    password.type = "password";
    toggleIcon.src = "../assets/icons/visibility_off.svg";
    toggleIcon.alt = "hide password";
  }
}


