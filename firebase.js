import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {

    apiKey: "ضع API KEY هنا",

    authDomain: "ضع Auth Domain هنا",

    projectId: "ضع Project ID هنا",

    storageBucket: "ضع Storage Bucket هنا",

    messagingSenderId: "ضع Sender ID هنا",

    appId: "ضع App ID هنا"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);
