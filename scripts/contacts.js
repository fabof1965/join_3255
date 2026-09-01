const indexLetter = 65;

function loopThroughAlphabet() {
    const contactContainer = document.getElementById("contacts");

    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        //wenn ein Kontakt mit dem ersten Buchstaben dem letter entspricht, soll der jeweilige
        //Buchstabe sowie der Kontakt angezeigt werden
        console.log(letter);
    }
}

function makeElementFromLetter(letter) {

}

function addNewContact() {
    //this function adds a new contact to the backend contact list
    console.log("New contact added.");
}

function loadContact() {

}

function showContact() {

}

function openContactDialog() {
    const contactDialog = document.getElementById("contact-dialog");

    contactDialog.showModal();
}

function closeContactDialog() {
    const contactDialog = document.getElementById("contact-dialog");

    contactDialog.close();
}