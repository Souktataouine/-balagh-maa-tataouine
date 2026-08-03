const PASSWORD = "Tataouine2026";

window.login = function () {

    const password = document.getElementById("password").value;

    if (password === PASSWORD) {

        localStorage.setItem("admin", "true");

        window.location.href = "admin.html";

    } else {

        alert("❌ كلمة المرور غير صحيحة");

    }

}
