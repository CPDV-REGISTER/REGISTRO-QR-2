// Capturamos el formulario
const formQR = document.getElementById("formQR");
const qrContainer = document.getElementById("qrContainer");

formQR.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const rut = document.getElementById("rut").value.trim();
    const curso = document.getElementById("curso").value.trim();

    // Generamos un identificador único para el QR
    const idQR = "QR_" + Date.now();

    // Calculamos hora de expiración
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + QR_VALIDEZ_HORAS);

    // Creamos un objeto con todos los datos que queremos dentro del QR
    const qrPayload = {
        idQR,
        nombre,
        rut,
        curso,
        fechaGenerado: new Date().toISOString(),
        fechaExpira: expiracion.toISOString()
    };

    // Enviamos datos a Google Sheets
    fetch(SCRIPT_URL_GENERAR_QR, {
        method: "POST",
        body: JSON.stringify(qrPayload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            // Mostramos el QR en pantalla con TODOS los datos codificados en JSON
            qrContainer.innerHTML = "";
            new QRCode(qrContainer, {
                text: JSON.stringify(qrPayload), // ✅ Ahora el QR contiene todo
                width: 200,
                height: 200
            });
        } else {
            alert("Error al generar QR");
        }
    })
    .catch(err => console.error("Error:", err));
});
