let testUser = JSON.parse(localStorage.getItem('testUser')) || [
    { 'email': 'meinetestemail@gmail.com', 'password': 'test123' },
];

let signUp = document.getElementById('sign-up-btn');
signUp.addEventListener("click", () => {
    window.location.href = "./pages/register.html";
});

/**
 * Validates the entered credentials and opens the summary page.
 * @param {SubmitEvent} event - Login form submission event.
 * @returns {void}
 */
function userLogin(event) {
    event.preventDefault();
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = testUser.find(user => user.email == email.value && user.password == password.value);
    if (user) {
        console.log("user gefunden");
        window.location.href = './pages/summary.html';
    }
}
