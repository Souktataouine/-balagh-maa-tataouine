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

// إحداثيات البلاغ
let latitude = 32.93;
let longitude = 10.45;

// إنشاء الخريطة
const map = L.map("map").setView([latitude, longitude], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
}).addTo(map);

// العلامة
let marker = L.marker([latitude, longitude]).addTo(map);

// تغيير الموقع عند الضغط
map.on("click", function (e) {

    latitude = e.latlng.lat;
    longitude = e.latlng.lng;

    marker.setLatLng(e.latlng);

});

// تحديد الموقع الحالي
if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position){

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        map.setView([latitude, longitude], 14);

        marker.setLatLng([latitude, longitude]);

    });

}

// إرسال البلاغ
window.sendReport = async function(){

    const name = document.getElementById("name").value.trim();
    const delegation = document.getElementById("delegation").value;
    const details = document.getElementById("details").value.trim();
    const type = document.getElementById("type").value;

    if(name==="" || details===""){

        alert("يرجى ملء جميع الخانات");

        return;

    }

    try{

        await addDoc(collection(db,"reports"),{

            name,
            delegation,
            details,
            type,

            latitude,
            longitude,

            date:Date.now()

        });

        alert("✅ تم إرسال البلاغ بنجاح");

        document.getElementById("name").value="";
        document.getElementById("details").value="";

        loadReports();

    }

    catch(e){

        console.error(e);

        alert(e.message);

    }

}
// تحميل البلاغات
async function loadReports(){

    const reports = document.getElementById("reports");

    reports.innerHTML = "جاري التحميل...";

    try{

        const q = query(
            collection(db,"reports"),
            orderBy("date","desc")
        );

        const snap = await getDocs(q);

        reports.innerHTML = "";

        snap.forEach(doc=>{

            const data = doc.data();

            reports.innerHTML += `
            <div class="report">
                <h3>📍 ${data.delegation}</h3>
                <p><strong>${data.type}</strong></p>
                <p>${data.details}</p>
                <small>👤 ${data.name}</small>
            </div>
            `;

            if(data.latitude && data.longitude){

                L.marker([data.latitude,data.longitude])
                .addTo(map)
                .bindPopup(`
                    <b>${data.delegation}</b><br>
                    ${data.type}<br>
                    ${data.details}<br>
                    👤 ${data.name}
                `);

            }

        });

    }

    catch(e){

        console.error(e);

        reports.innerHTML="حدث خطأ أثناء تحميل البلاغات";

    }

}

// تحميل البلاغات عند فتح الصفحة
loadReports();
