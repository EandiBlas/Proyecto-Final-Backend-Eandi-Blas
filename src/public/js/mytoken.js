const url = new URL(window.location.href);
const token = url.pathname.split('/')[url.pathname.split('/').length-1]
const form = document.getElementById("resetPasswordForm");
form.action = `/api/auth/reset-password/${token}`;
// form.addEventListener("submit", function (event) {
//     event.preventDefault(); // Evita que el formulario se envíe de inmediato
//     // Espera 2 segundos y luego redirige
//     setTimeout(function () {
//       window.location.href = "/api/auth/reset-success";
//     }, 2000);
//   });