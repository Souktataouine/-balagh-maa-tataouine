import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
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

window.sendReport = async () => {

    const name = document.getElementById("name").value.trim();
    const delegation = document.getElementById("delegation").value;
    const details = document.getElementById("details").value.trim();

    if (!name || !details) {
        alert("يرجى ملء جميع الخانات");
        return;
    }

    try {

        await addDoc(collection(db, "reports"), {
            name,
            delegation,
            details,
            date: Date.now()
        });

        alert("✅ تم إرسال البلاغ");

        document.getElementById("name").value = "";
        document.getElementById("details").value = "";

        loadReports();

    } catch (e) {

        console.error(e);
        alert(e.message);

    }

};

async function loadReports() {

    const reports = document.getElementById("reports");

    reports.innerHTML = "جاري التحميل...";

    const q = query(
        collection(db, "reports"),
        orderBy("date", "desc")
    );

    const snap = await getDocs(q);

    reports.innerHTML = "";

    snap.forEach(doc => {

        const data = doc.data();

        reports.innerHTML += `
        <div class="report">
            <h3>📍 ${data.delegation}</h3>
            <p>${data.details}</p>
            <small>👤 ${data.name}</small>
        </div>
        `;

    });

}

loadReports();
const map = L.map('map').setView([32.93,10.45],10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let marker = L.marker([32.93,10.45]).addTo(map);

map.on("click", function(e) {
    marker.setLatLng(e.latlng);
});
