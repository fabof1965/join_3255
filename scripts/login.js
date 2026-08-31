let testUser = JSON.parse(localStorage.getItem('testUser')) || [
    { 'email': 'meinetestemail@gmail.com', 'password': 'test123' },
];

function logInGuestUser() {
    const GUEST_USER = { // guest user object
        email: "guestuser@mail.de",
        password: "guestpassword"
    };
    sessionStorage.setItem(JSON.stringify, GUEST_USER);
    window.location.href = './pages/summary_guest.html';

    // sessionStorage
    // wohin soll die reise gehen
}

let signUp = document.getElementById('sign-up-btn');
signUp.addEventListener("click", () => {
    window.location.href = "./pages/signup.html"
});

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

// funktion in der ich user aus der firebase einloggen kann
// guest login funktion
