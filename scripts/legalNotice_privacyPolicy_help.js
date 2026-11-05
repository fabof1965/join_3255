const backBtn = document.querySelector(".back-btn");

/**
 * Returns to the previous page or opens the board directly.
 * @returns {void}
 */
function backToPreviousPage() {
  if(backBtn.classList.contains("start")) {
    window.location.href = "../index.html";
    return;
  }
  
  if (document.referrer) {
    window.history.back();
    return;
  }

  window.location.href = "./board.html";
}

if(backBtn) backBtn.addEventListener("click", backToPreviousPage);
