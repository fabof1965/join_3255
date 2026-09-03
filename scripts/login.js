let email = document.getElementById('email');
let password = document.getElementById('password');

function logInGuestUser() {
    const GUEST_USER = {
        email: "guestuser@mail.de",
        password: "guestpassword"
    };
    sessionStorage.setItem(JSON.stringify, GUEST_USER);
    window.location.href = './pages/summary_guest.html';
}

let signUp = document.getElementById('sign-up-btn');
signUp.addEventListener("click", () => {
    window.location.href = "./pages/signup.html"
});

password.addEventListener("input", () => {
    password.setCustomValidity("");
})

/**
 * Validates the entered credentials and opens the summary page.
 * @param {SubmitEvent} event - Login form submission event.
 * @returns {void}
 */

async function userLogin(event) {
    event.preventDefault();
    let response = await getData('users');
    let users = response ? Object.values(response) : [];
    let user = users.find(user => user.email === email.value && user.password === password.value);
    if (user) {
        console.log("user gefunden");
        window.location.href = './pages/summary.html';
    } else {
        email.setCustomValidity("User nicht gefunden");
        email.reportValidity();
    }
}

    // 1. Formular-Standardverhalten verhindern (bereits oben mit preventDefault erledigt)

    // 2. Eingegebene Werte aus den Input-Feldern auslesen
    //    -> email.value und password.value

    // 3. Alle registrierten User von Firebase holen
    //    -> await getData('users') liefert ein Objekt { id1: {...}, id2: {...} }

    // 4. Firebase-Objekt in ein Array umwandeln, um es durchsuchen zu können
    //    -> Object.values(response)

    // 5. Prüfen, ob ein User mit passender E-Mail existiert
    //    -> userArray.find(user => user.email === email.value)

    // 6. Falls kein User gefunden wurde -> Fehler anzeigen
    //    -> z.B. email.setCustomValidity("E-Mail nicht gefunden") + email.reportValidity()
    //    -> return, damit die Funktion hier abbricht

    // 7. Falls User gefunden wurde, Passwort vergleichen
    //    -> foundUser.password === password.value

    // 8. Falls Passwort falsch ist -> Fehler anzeigen
    //    -> z.B. password.setCustomValidity("Passwort falsch") + password.reportValidity()
    //    -> return

    // 9. Falls Login erfolgreich: Nutzerdaten für die restliche App merken
    //    -> z.B. sessionStorage.setItem('currentUser', JSON.stringify(foundUser))

    // 10. Weiterleitung zur eingeloggten Ansicht
    //     -> window.location.href = './pages/summary.html'


// funktion in der ich user aus der firebase einloggen kann
// guest login funktion
