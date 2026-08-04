import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
alert("بدأ تشغيل app.js");
let latitude = 32.93;
let longitude = 10.45;

// ===== الخريطة =====

const map = L.map("map").setView([32.93, 10.45], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const marker = L.marker([latitude, longitude]).addTo(map);

map.on("click", (e) => {

  latitude = e.latlng.lat;
  longitude = e.latlng.lng;

  marker.setLatLng(e.latlng);

});

// ===== إرسال البلاغ =====

window.sendReport = async () => {

  const name = document.getElementById("name").value.trim();
  const delegation = document.getElementById("delegation").value;
  const type = document.getElementById("type").value;
  const details = document.getElementById("details").value.trim();

  if (!name || !details) {
    alert("يرجى ملء جميع الخانات");
    return;
  }

  await addDoc(collection(db, "reports"), {

    name,
    delegation,
    type,
    details,
    latitude,
    longitude,
    date: Date.now()

  });

  alert("تم إرسال البلاغ");

  document.getElementById("name").value = "";
  document.getElementById("details").value = "";

  loadReports();

};
// ======================
// تحميل البلاغات
// ======================

async function loadReports() {

    const reports = document.getElementById("reports");

    reports.innerHTML = "جاري التحميل...";

    try {

        const snap = await getDocs(collection(db, "reports"));
alert("عدد البلاغات: " + snap.size);
        reports.innerHTML = "";

        if (snap.empty) {

            reports.innerHTML = "<p>لا توجد بلاغات حتى الآن.</p>";
            return;

        }

        snap.forEach((report) => {

            const data = report.data();

            reports.innerHTML += `

            <div class="report">

                <h3>📍 ${data.delegation}</h3>

                <p><strong>${data.type || ""}</strong></p>

                <p>${data.details}</p>

                <small>👤 ${data.name}</small>

                <br><br>

                <button onclick="deleteReport('${report.id}')">

                    🗑 حذف البلاغ

                </button>

            </div>

            `;

            if (data.latitude && data.longitude) {

                L.marker([data.latitude, data.longitude])
                    .addTo(map)
                    .bindPopup(`
                        <b>${data.delegation}</b><br>
                        ${data.details}<br>
                        👤 ${data.name}
                    `);

            }

        });

    } catch (e) {

        console.error(e);

alert(e.message);

reports.innerHTML = "❌ " + e.message;

    }// ======================
// حذف البلاغ
// ======================

window.deleteReport = async function(id){

    const password = prompt("أدخل كلمة السر");

    if(password !== "Tataouine2025"){

        alert("❌ كلمة السر غير صحيحة");

        return;

    }

    const ok = confirm("هل تريد حذف هذا البلاغ؟");

    if(!ok){

        return;

    }

    try{

        await deleteDoc(doc(db,"reports",id));

        alert("✅ تم حذف البلاغ");

        loadReports();

    }catch(e){

        console.error(e);

        alert("حدث خطأ أثناء الحذف");

    }

};

// ======================
// تشغيل التطبيق
// ======================

loadReports();

}
