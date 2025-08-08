// Elementos de la interfaz
const resultDiv = document.getElementById("result");

// Iniciar el lector de QR usando la cámara
function startScanner() {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Cámara trasera por defecto
        { fps: 10, qrbox: 250 },        // Configuración del escaneo
        (decodedText) => {
            procesarQR(decodedText);
            html5QrCode.stop(); // Evitar múltiples lecturas
        },
        (errorMessage) => {
            // Errores de lectura del QR (no hacemos nada)
        }
    ).catch((err) => {
        console.error("Error iniciando cámara:", err);
    });
}

// Procesar QR leído
function procesarQR(qrContenido) {
    let qrData;

    try {
        // Intentamos convertir el texto del QR a objeto JSON
        qrData = JSON.parse(qrContenido);
    } catch (error) {
        resultDiv.textContent = "❌ QR no válido (formato incorrecto)";
        resultDiv.style.color = "red";
        return;
    }

    // Verificamos si tiene fecha de expiración
    if (!qrData.fechaExpira) {
        resultDiv.textContent = "❌ QR inválido (faltan datos)";
        resultDiv.style.color = "red";
        return;
    }

    const ahora = new Date();
    const expira = new Date(qrData.fechaExpira);

    // Comprobamos si está vencido
    if (ahora > expira) {
        resultDiv.textContent = "❌ QR vencido";
        resultDiv.style.color = "red";
        return;
    }

    // Si es válido, registramos el ingreso en Google Sheets
    fetch(SCRIPT_URL_VERIFICAR_QR, {
        method: "POST",
        body: JSON.stringify({
            idQR: qrData.idQR,
            nombre: qrData.nombre,
            rut: qrData.rut,
            curso: qrData.curso,
            fechaGenerado: qrData.fechaGenerado,
            fechaEscaneado: ahora.toISOString()
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            resultDiv.textContent = "✅ Acceso permitido";
            resultDiv.style.color = "green";
        } else {
            resultDiv.textContent = "❌ Error al registrar";
            resultDiv.style.color = "red";
        }
    })
    .catch(err => {
        console.error("Error:", err);
        resultDiv.textContent = "❌ Error de conexión";
        resultDiv.style.color = "red";
    });
}

// Iniciar el escaneo al cargar la página
startScanner();
