function renderRotationWarning() {
    document.body.insertAdjacentHTML("afterbegin", getRotationWarningTemplate());
}
document.addEventListener("DOMContentLoaded", renderRotationWarning);

function getRotationWarningTemplate() {
    return`
        <div class="landscape-warning" role="alert" aria-live="polite">
            <div class="landscape-warning__content">
            <img class="rotation-icon" src="../assets/icons/mobile_rotate.svg" alt="mobile rotation hint">
                <p class="landscape-warning-title">Bitte Gerät drehen</p>
                <div>
                    <p class="landscape-warning-text">Diese Ansicht ist für das Hochformat (Portrait) optimiert.</p>
                </div>
                </p>
            </div>
        </div>`
}
