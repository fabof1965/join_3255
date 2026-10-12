import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { getDatabase } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAknf8eKlgeJhoxz4VkKiGJs1UWueNUTTM",
    authDomain: "join-3255.firebaseapp.com",
    databaseURL: "https://join-3255-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "join-3255",
    storageBucket: "join-3255.firebasestorage.app",
    messagingSenderId: "301039811414",
    appId: "1:301039811414:web:59a8902ca02d464b84f4f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);