const media = window.matchMedia("screen and (orientation: landscape) and (pointer: coarse) and (max-width: 950px) and (max-height: 600px)");

document.addEventListener("DOMContentLoaded", () => {
    showLandscapeMode();
})

media.addEventListener("change", () => {
    showLandscapeMode();
});

function showLandscapeMode() {
    let landscape = document.getElementById("landscape-modus");
    if (!landscape) {
        document.body.insertAdjacentHTML("afterbegin", getRotationWarningTemplate());
        landscape = document.getElementById("landscape-modus");
    }
    landscape.style.display = media.matches ? "flex" : "none";
}

function getRotationWarningTemplate() {
    return`
        <div id="landscape-modus" class="landscape-warning" role="alert" aria-live="polite">
            <div class="landscape-warning-content">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="80px" width="80px" fill="var(--white-color)"><path d="M12.4,19.45L4.58,11.6Q4.3,11.33 4.15,10.98T4,10.25T4.15,9.52T4.58,8.9L8.9,4.57Q9.18,4.3 9.53,4.16t0.72-0.14t0.73,0.14T11.6,4.57l7.82,7.82q0.28,0.28 0.43,0.63Q20,13.38 20,13.75t-0.15,0.72T19.43,15.1L15.1,19.45q-0.28,0.28-0.63,0.41T13.75,20t-0.72-0.14T12.4,19.45ZM13.75,18L18,13.75L10.25,6L6,10.25L13.75,18ZM12,24q-2.47,0-4.66-0.94T3.51,20.49T0.94,16.66T0,12H2q0,1.77 0.6,3.4q0.6,1.62 1.66,2.92T6.8,20.54t3.22,1.29L7.4,19.2l1.4-1.4l5.9,5.9q-0.65,0.15-1.34,0.23T12,24ZM22,12q0-1.78-0.6-3.4q-0.6-1.63-1.66-2.92T17.2,3.46q-1.47-0.91-3.22-1.29L16.6,4.8L15.2,6.2L9.3,0.3q0.65-0.15 1.34-0.22T12,0q2.48,0 4.66,0.94t3.82,2.57t2.57,3.82T24,12H22ZM12,12ZM9.33,10.1q0.32,0 0.54-0.22t0.21-0.53q0-0.33-0.21-0.54T9.33,8.6q-0.3,0-0.53,0.21Q8.58,9.02 8.58,9.35q0,0.3 0.22,0.53T9.33,10.1Z"/></svg>
                <p class="landscape-warning-title">Please rotate your device!</p>
                <div>
                    <p class="landscape-warning-text">Join works best in portrait mode.</p>
                </div>
            </div>
        </div>`
}
