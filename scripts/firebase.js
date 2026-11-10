const BASE_URL = "https://join-3255-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Builds the Firebase REST URL for a path, including the auth token of the current user.
 * Waits until the auth state is ready before reading the token.
 * @param {string} path - Relative database path.
 * @returns {Promise<string>} Full URL with the ".json" suffix and the auth query parameter.
 * @throws {Error} If the auth module cannot be loaded or the token cannot be read.
 */
async function getAuthUrl(path) {
  try {
    const { auth } = await import("./firebaseInit.js");
    await auth.authStateReady();
    const token = await auth.currentUser?.getIdToken();
    return BASE_URL + path + ".json?auth=" + token;
  } catch (error) {
    console.error("Fehler beim Erstellen der Auth-URL", error);
    throw error;
  }
}

/**
 * Retrieves data from a Firebase path (GET).
 * Errors are logged and not rethrown.
 * @param {string} path - Relative database path.
 * @returns {Promise<*|undefined>} Retrieved Firebase data, or undefined if the request failed.
 */
async function getData(path = "") {
  try {
    let response = await fetch(await getAuthUrl(path));
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Laden der Daten");
  }
}

/**
 * Creates a new entry with a generated key at a Firebase path (POST).
 * @param {string} path - Relative database path.
 * @param {Object} data - Data to create.
 * @returns {Promise<{name: string}>} Firebase response containing the generated key.
 * @throws {Error} If the request fails.
 */
async function postData(path = "", data = {}) {
  try {
    let response = await fetch(await getAuthUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Hochladen der Daten", error);
    throw error;
  }
}

/**
 * Updates only the given fields at a Firebase path (PATCH).
 * @param {string} path - Relative database path.
 * @param {Object} data - Fields to update.
 * @returns {Promise<Object>} Firebase response with the updated fields.
 * @throws {Error} If the request fails.
 */
async function patchData(path = "", data = {}) {
  try {
    let response = await fetch(await getAuthUrl(path), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Fehler beim aktualisieren der Daten", error);
    throw error;
  }
}

/**
 * Deletes the data at a Firebase path (DELETE).
 * @param {string} path - Relative database path.
 * @returns {Promise<null>} Firebase response, which is null on success.
 * @throws {Error} If the request fails.
 */
async function deleteData(path = "") {
  try {
    let response = await fetch(await getAuthUrl(path), {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Fehler beim löschen der Daten", error);
    throw error;
  }
}