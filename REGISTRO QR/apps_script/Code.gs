/**
 * Google Apps Script - Code.gs
 * Este archivo centraliza las funciones:
 * - doPost: guarda QR generados (desde modulo1)
 * - doGet: maneja validación de QR y consultas (obtenerTodo)
 *
 * IMPORTANTE:
 * - Cambia SPREADSHEET_ID por el ID real de tu Google Sheet.
 * - Implementa la WebApp con permiso "Cualquiera con el enlace".
 */

const SPREADSHEET_ID = "PEGAR_AQUI_ID_DE_TU_HOJA"; // Reemplazar

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("QR_Generados");
    sheet.appendRow([
      data.idQR,
      data.nombre,
      data.rut,
      data.curso,
      data.fechaGenerado,
      data.fechaExpira,
      "" // Fecha_Ingreso inicialmente vacía
    ]);
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    // Acción para obtener todos los registros (usada por panel)
    if (e.parameter && e.parameter.accion === "obtenerTodo") {
      const datos = obtenerTodo();
      return ContentService.createTextOutput(JSON.stringify(datos)).setMimeType(ContentService.MimeType.JSON);
    }

    // Validación de QR (cuando se pasa idQR)
    if (e.parameter && e.parameter.idQR) {
      return validarQR(e.parameter.idQR);
    }

    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Solicitud inválida"})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function obtenerTodo() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("QR_Generados");
  return sheet.getDataRange().getValues();
}

function validarQR(idQR) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("QR_Generados");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === idQR) {
      const fechaExpira = new Date(data[i][5]);
      const ahora = new Date();
      const vigente = ahora <= fechaExpira;

      // Si es vigente y aún no tiene fecha de ingreso, la registramos
      if (vigente && !data[i][6]) {
        sheet.getRange(i + 1, 7).setValue(ahora.toISOString());
      }

      return ContentService.createTextOutput(JSON.stringify({status: "success", vigente: vigente})).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({status: "error", message: "QR no encontrado"})).setMimeType(ContentService.MimeType.JSON);
}
