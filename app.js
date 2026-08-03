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
apiKey:"AIzaSyBJ1ayE2j6QcnhNkS-yJ8W3H7B3UpH5UHA",
authDomain:"balagh-maa-tataouine.firebaseapp.com",
projectId:"balagh-maa-tataouine",
storageBucket:"balagh-maa-tataouine.firebasestorage.app",
messagingSenderId:"511775432495",
appId:"1:511775432495:web:a8c440db80eba59dd40bda",
measurementId:"G-ZYNNL1XLC3"
};

const app=initializeApp(firebaseConfig);
const db=getFirestore(app);

let latitude="";
let longitude="";

document.getElementById("locationBtn").onclick=function(){

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(function(pos){

latitude=pos.coords.latitude;
longitude=pos.coords.longitude;

alert("تم تحديد الموقع");

});

}else{

alert("الموقع غير مدعوم");

}

};
document.getElementById("sendBtn").onclick = async function () {

const name = document.getElementById("name").value;
const delegation = document.getElementById("delegation").value;
const details = document.getElementById("details").value;

if(name==="" || details===""){
alert("يرجى ملء جميع الخانات");
return;
}

await addDoc(collection(db,"reports"),{

name:name,
delegation:delegation,
details:details,
latitude:latitude,
longitude:longitude,
date:Date.now()

});

alert("تم إرسال البلاغ بنجاح ✅");

document.getElementById("name").value="";
document.getElementById("details").value="";

loadReports();

};
async function loadReports(){

const reports=document.getElementById("reports");

reports.innerHTML="";

const q=query(
collection(db,"reports"),
orderBy("date","desc")
);

const snapshot=await getDocs(q);

snapshot.forEach((doc)=>{

const data=doc.data();

reports.innerHTML+=`

<div class="report">

<h3>📍 ${data.delegation}</h3>

<p>${data.details}</p>

<small>👤 ${data.name}</small>

${data.latitude && data.longitude ? `
<br><br>
<a href="https://www.google.com/maps?q=${data.latitude},${data.longitude}" target="_blank">
📍 عرض الموقع على الخريطة
</a>
` : ""}

</div>

`;

});

}

loadReports();
