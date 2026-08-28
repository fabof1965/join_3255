async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return data = await response.json();
}

async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    console.log(path)
    return responseToJson = await response.json();
}

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