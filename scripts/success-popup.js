let successPopupTimer;

/** Shows a success message in the same style as the registration popup. */
function showSuccessPopup(message) {
  let dialog = document.getElementById("success-popup");

  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "success-popup";
    dialog.className = "success-popup";
    dialog.setAttribute("aria-labelledby", "success-popup-message");

    const heading = document.createElement("h2");
    heading.id = "success-popup-message";

    dialog.appendChild(heading);
    document.body.appendChild(dialog);
  }

  clearTimeout(successPopupTimer);
  dialog.querySelector("h2").textContent = message;

  if (!dialog.open) {
    dialog.showModal();
  }

  successPopupTimer = setTimeout(() => dialog.close(), 1500);
}
