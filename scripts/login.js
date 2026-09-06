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
 * Handle the login form submission.
 * @param {Event} event - Login form submission event.
 */
async function userLogin(event) {
    console.log("submit ausgelöst");
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
