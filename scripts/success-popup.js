let successPopupTimer;

/**
 * Creates the success popup dialog with an empty heading and appends it to the body.
 * @returns {HTMLDialogElement} The newly created dialog element.
 */
function createSuccessDialog() {
  const dialog = document.createElement("dialog");
  dialog.id = "success-popup";
  dialog.className = "success-popup";
  dialog.setAttribute("aria-labelledby", "success-popup-message");
  dialog.innerHTML = '<h2 id="success-popup-message"></h2>';
  document.body.appendChild(dialog);
  return dialog;
}

/**
 * Shows a success message in a modal popup and closes it automatically after 1.5 seconds.
 * Creates the dialog on first use and restarts the timer if the popup is already open.
 * @param {string} message - The text to display in the popup.
 */
function showSuccessPopup(message) {
  const dialog =  document.getElementById("success-popup") || createSuccessDialog();
  clearTimeout(successPopupTimer);
  dialog.querySelector("h2").textContent = message;
  if (!dialog.open) dialog.showModal();
  successPopupTimer = setTimeout(() => dialog.close(), 1500);
}


/**
 * @description Displays a pop-up message when a task is created.
 * @param {string} message - “Task created” is shown in the pop-up.
 */
function showPopup(message = "Task created") {
  document.getElementById("popup")?.remove();
  document.body.insertAdjacentHTML("beforeend", getPopupTemplate());
  const popup = document.getElementById("popup");
  if (!popup) throw new Error("Could not create the success popup.");
  popup.querySelector("h2").textContent = message;
  popup.showModal();
  window.setTimeout(() => {
    if (popup.open) popup.close();
    popup.remove();
  }, 3000);
}