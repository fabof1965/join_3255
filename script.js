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

/* login and signup functions */

let passwordInputFields = [
  {
    input: document.getElementById('password'),
    icon: document.getElementById('password-toggle-icon'),
  },
  {
    input: document.getElementById("confirm-password"),
    icon: document.getElementById('confirm-password-toggle-icon'),
  },
];

function initPasswordEventListener() {
  passwordInputFields.forEach((field) => {
    if (!field.input || !field.icon) return;
    field.input.addEventListener('input', () => handleEmptyPasswordInput(field));
    field.input.addEventListener('focus', () => handlePasswordFocus(field));
    field.icon.addEventListener('click', () => toggleShowPassword(field));
  });

}

function handlePasswordFocus(field) {
  if (field.input.type === "password") {
    field.icon.src = "../assets/icons/visibility_off.svg";
    field.icon.alt = "hide password";
  }
}

function handleEmptyPasswordInput(field) {
  if (field.input.value === "") {
    field.icon.src = "../assets/icons/lock.svg";
    field.icon.alt = "lock-img";
  }
}

function toggleShowPassword(field) {
  if (field.input.type === "password") {
    field.input.type = "text";
    field.icon.src = '../assets/icons/visibility.svg';
    field.icon.alt = "show password";
  } else {
    field.input.type = "password";
    field.icon.src = "../assets/icons/visibility_off.svg";
    field.icon.alt = "hide password";
  }
}

initPasswordEventListener();

/* login and signup functions END */


