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

// ===== الخريطة =====

const map = L.map("map").setView([32.93, 10.45], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const marker = L.marker([32.93, 10.45]).addTo(map);

map.on("click", (e) => {
  marker.setLatLng(e.latlng);
  latitude = e.latlng.lat;
  longitude = e.latlng.lng;
});

// ===== إرسال البلاغ =====

window.sendReport = async function () {

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

  alert("✅ تم إرسال البلاغ");

  document.getElementById("name").value = "";
  document.getElementById("details").value = "";

  loadReports();
};// ===== تحميل البلاغات =====

async function loadReports() {

  const reports = document.getElementById("reports");

  reports.innerHTML = "جاري التحميل...";

  try {

    const q = query(
      collection(db, "reports"),
      orderBy("date", "desc")
    );

    const snap = await getDocs(q);

    reports.innerHTML = "";

    if (snap.empty) {
      reports.innerHTML = "<p>لا توجد بلاغات.</p>";
      return;
    }

    snap.forEach((report) => {

      const data = report.data();

      reports.innerHTML += `
      <div class="report">

        <h3>📍 ${data.delegation}</h3>

        <p><strong>${data.type}</strong></p>

        <p>${data.details}</p>

        <small>👤 ${data.name}</small>

        <br><br>

        <button onclick="deleteReport('${report.id}')">
          🗑️ حذف البلاغ
        </button>

      </div>

      <hr>
      `;

    });

  } catch (e) {

    console.error(e);

    reports.innerHTML = "❌ حدث خطأ أثناء تحميل البلاغات.";

  }
// ===== حذف البلاغ =====

window.deleteReport = async function(id) {

    const password = prompt("أدخل كلمة السر");

    if (password !== "Tataouine2025") {
        alert("❌ كلمة السر غير صحيحة");
        return;
    }

    const ok = confirm("هل تريد حذف هذا البلاغ؟");

    if (!ok) {
        return;
    }

    try {

        await deleteDoc(doc(db, "reports", id));

        alert("✅ تم حذف البلاغ");

        loadReports();

    } catch (e) {

        console.error(e);

        alert("حدث خطأ أثناء الحذف");

    }

};

// ===== تشغيل التطبيق =====

loadReports();
}
