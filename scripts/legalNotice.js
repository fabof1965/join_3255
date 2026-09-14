/**
 * Returns to the previous page or opens the board directly.
 * @returns {void}
 */
function leaveLegalNotice() {
  if (document.referrer) {
    window.history.back();
    return;
  }
  window.location.href = "./board.html";
}


document.querySelector(".legal-back-button").addEventListener("click", leaveLegalNotice);
