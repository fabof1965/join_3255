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
        password.setCustomValidity("Check your email and password. Please try again");
        password.reportValidity();
    }
}
