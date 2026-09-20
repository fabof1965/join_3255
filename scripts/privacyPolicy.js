/**
 * Returns to the previous page or opens the board directly.
 * @returns {void}
 */
function leavePrivacyPolicy() {
  if (document.referrer) {
    window.history.back();
    return;
  }
  window.location.href = "./board.html";
}


document.querySelector(".privacy-policy-back-button").addEventListener("click", leavePrivacyPolicy);
