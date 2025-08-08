// Elementos de la interfaz
const resultDiv = document.getElementById("result");

// Iniciar el lector de QR usando la cámara
function startScanner() {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Cámara trasera por defecto
        { fps: 10, qrbox: 250 },        // Configuración del escaneo
        (decodedText) => {
            // Cuando se detecta un QR, lo procesamos
            procesarQR(decodedText);
            html5QrCode.stop(); // Detenemos el escaneo para evitar múltiples lecturas
        },
        (errorMessage) => {
            // Errores de lectura (no es necesario mostrar nada aquí)
        }
    ).catch((err) => {
        console.error("Error iniciando cámara:", err);
    });
}

// Procesar QR leído
function procesarQR(idQR) {
    fetch(SCRIPT_URL_VERIFICAR_QR + "?idQR=" + encodeURIComponent(idQR))
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            if (data.vigente) {
                resultDiv.textContent = "✅ Acceso permitido";
                resultDiv.style.color = "green";
            } else {
                resultDiv.textContent = "❌ QR vencido";
                resultDiv.style.color = "red";
            }
        } else {
            resultDiv.textContent = "❌ QR no encontrado";
            resultDiv.style.color = "red";
        }
    })
    .catch(err => {
        console.error("Error:", err);
        resultDiv.textContent = "❌ Error en la verificación";
        resultDiv.style.color = "red";
    });
}

// Iniciar el escaneo al cargar la página
startScanner();