if(localStorage.getItem("admin")!=="true"){

    window.location.href="login.html";

}
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
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

const reportsDiv = document.getElementById("reports");
const totalReports = document.getElementById("totalReports");
const todayReports = document.getElementById("todayReports");

async function loadReports(){

    reportsDiv.innerHTML="";

    const snapshot = await getDocs(collection(db,"reports"));

    totalReports.innerHTML = snapshot.size;

    let today = 0;

    snapshot.forEach(async(item)=>{

        const data = item.data();

        if(data.date){

            const reportDate = new Date(data.date);
            const now = new Date();

            if(
                reportDate.getDate()===now.getDate() &&
                reportDate.getMonth()===now.getMonth() &&
                reportDate.getFullYear()===now.getFullYear()
            ){
                today++;
            }

        }

        reportsDiv.innerHTML += `
        <div class="report">

            <h3>📍 ${data.delegation}</h3>

            <p><b>👤</b> ${data.name}</p>

            <p><b>📝</b> ${data.details}</p>

            <p><b>🚰</b> ${data.type || "غير محدد"}</p>

            <button class="done"
            onclick="doneReport('${item.id}')">

            ✅ تم الإصلاح

            </button>

            <button class="delete"
            onclick="deleteReport('${item.id}')">

            🗑 حذف

            </button>

        </div>
        `;

    });

    todayReports.innerHTML=today;

}

window.deleteReport = async(id)=>{

    if(confirm("هل تريد حذف البلاغ؟")){

        await deleteDoc(doc(db,"reports",id));

        loadReports();

    }

}

window.doneReport = async(id)=>{

    await updateDoc(doc(db,"reports",id),{

        status:"تم الإصلاح"

    });

    alert("تم تحديث البلاغ");

}

loadReports();
