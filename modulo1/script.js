// Capturamos el formulario
const formQR = document.getElementById("formQR");
const qrContainer = document.getElementById("qrContainer");

formQR.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const rut = document.getElementById("rut").value;
    const curso = document.getElementById("curso").value;

    // Generamos un identificador único para el QR
    const idQR = "QR_" + Date.now();

    // Calculamos hora de expiración
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + QR_VALIDEZ_HORAS);

    // Enviamos datos a Google Sheets
    fetch(SCRIPT_URL_GENERAR_QR, {
        method: "POST",
        body: JSON.stringify({
            idQR,
            nombre,
            rut,
            curso,
            fechaGenerado: new Date().toISOString(),
            fechaExpira: expiracion.toISOString()
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            // Mostramos el QR en pantalla
            qrContainer.innerHTML = "";
            new QRCode(qrContainer, {
                text: idQR,
                width: 200,
                height: 200
            });
        } else {
            alert("Error al generar QR");
        }
    })
    .catch(err => console.error("Error:", err));
});