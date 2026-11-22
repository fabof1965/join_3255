function renderRotationWarning() {
    document.body.insertAdjacentHTML("afterbegin", getRotationWarningTemplate());
}
document.addEventListener("DOMContentLoaded", renderRotationWarning);

function getRotationWarningTemplate() {
    return`
        <div class="landscape-warning" role="alert" aria-live="polite">
            <div class="landscape-warning__content">
            <img class="rotation-icon" src="../assets/icons/mobile_rotate.svg" alt="mobile rotation hint">
                <p class="landscape-warning-title">Please rotate your device!</p>
                <div>
                    <p class="landscape-warning-text">Join works best in portrait mode.</p>
                </div>
                </p>
            </div>
        </div>`
}
