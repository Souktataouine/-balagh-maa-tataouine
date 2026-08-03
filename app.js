import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let latitude = 32.93;
let longitude = 10.45;

// =========================
// الخريطة
// =========================

const map = L.map("map").setView([32.93, 10.45], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
}).addTo(map);

const marker = L.marker([32.93,10.45]).addTo(map);

map.on("click", function(e){

    marker.setLatLng(e.latlng);

    latitude = e.latlng.lat;
    longitude = e.latlng.lng;

});

// =========================
// إرسال البلاغ
// =========================

window.sendReport = async function(){

    const name = document.getElementById("name").value.trim();

    const delegation = document.getElementById("delegation").value;

    const details = document.getElementById("details").value.trim();

    if(name==="" || details===""){

        alert("يرجى ملء جميع الخانات");

        return;

    }

    await addDoc(collection(db,"reports"),{

        name,
        delegation,
        details,
        latitude,
        longitude,
        date:Date.now()

    });

    alert("✅ تم إرسال البلاغ");

    document.getElementById("name").value="";
    document.getElementById("details").value="";

    loadReports();

}
