const BASE_URL = "https://join-3255-default-rtdb.europe-west1.firebasedatabase.app/";

async function getAuthUrl(path) {
    const { auth } = await import("./firebaseInit.js");
    await auth.authStateReady();
    const token = await auth.currentUser?.getIdToken();
    return BASE_URL + path + ".json?auth=" + token;
}

/**
 * Retrieves data from a Firebase path.
 * @param {string} path - Relative database path.
 * @returns {Promise<*>} Retrieved Firebase data.
 */
async function getData(path = "") {
    try {
        let response = await fetch(await getAuthUrl(path));
        return data = await response.json();
    } catch (error) {
        console.error("Fehler beim Laden der Daten");
    }
}

/**
 * Creates data at a Firebase path.
 * @param {string} path - Relative database path.
 * @param {Object} data - Data to create.
 * @returns {Promise<*>} Firebase response data.
 */
async function postData(path = "", data = {}) {
    try {
        let response = await fetch(await getAuthUrl(path), {
            method: "POST",
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
        return responseToJson = await response.json();
    } catch (error) {
        console.error('Fehler beim Hochladen der Daten', error);
    }
}

/**
 * Updates data at a Firebase path.
 * @param {string} path - Relative database path.
 * @param {Object} data - Data to update.
 * @returns {Promise<*>} Firebase response data.
 */
async function patchData(path = "", data = {}) {
    try {
        let response = await fetch(await getAuthUrl(path), {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
        return responseToJson = await response.json();
    } catch (error) {
        console.error('Fehler beim aktualisieren der Daten', error);
    }
}

async function deleteData(path = "") {
    try {
        let response = await fetch(await getAuthUrl(path), {
            method: "DELETE",
        });
        return responseToJson = await response.json();
    } catch (error) {
        console.error('Fehler beim löschen der Daten', error);
    }
}
