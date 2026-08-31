/**
 * Retrieves data from a Firebase path.
 * @param {string} path - Relative database path.
 * @returns {Promise<*>} Retrieved Firebase data.
 */
async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return data = await response.json();
}

/**
 * Deletes data at a Firebase path.
 * @param {string} path - Relative database path.
 * @returns {Promise<*>} Firebase response data.
 */
async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    console.log(path)
    return responseToJson = await response.json();
}

/**
 * Creates data at a Firebase path.
 * @param {string} path - Relative database path.
 * @param {Object} data - Data to create.
 * @returns {Promise<*>} Firebase response data.
 */
async function postData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
        return responseToJson = await response.json();
    } catch (error) {
        console.error('Fehler beim Hochladen der Post-Daten', error);
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
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
        return responseToJson = await response.json();
    } catch (error) {
        console.error('Fehler beim Hochladen der Patchdaten', error);
    }
}
