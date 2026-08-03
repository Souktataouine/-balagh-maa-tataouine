import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyBJ1ayE2j6QcnhNkS-yJ8W3H7B3UpH5UHA",

  authDomain: "balagh-maa-tataouine.firebaseapp.com",

  projectId: "balagh-maa-tataouine",

  storageBucket: "balagh-maa-tataouine.firebasestorage.app",

  messagingSenderId: "511775432495",

  appId: "1:511775432495:web:a8c440db80eba59dd40bda"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
