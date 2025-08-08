function cargarDatos() {
    fetch(SCRIPT_URL_VERIFICAR_QR + "?accion=obtenerTodo")
    .then(res => res.json())
    .then(data => {
        mostrarTabla(data);
    });
}

function mostrarTabla(datos) {
    const tbody = document.querySelector("#tablaDatos tbody");
    tbody.innerHTML = "";
    datos.forEach(fila => {
        const tr = document.createElement("tr");
        fila.forEach(col => {
            const td = document.createElement("td");
            td.textContent = col;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function aplicarFiltros() {
    const nombre = document.getElementById("filtroNombre").value.toLowerCase();
    const curso = document.getElementById("filtroCurso").value.toLowerCase();
    const desde = document.getElementById("filtroDesde").value;
    const hasta = document.getElementById("filtroHasta").value;

    fetch(SCRIPT_URL_VERIFICAR_QR + "?accion=obtenerTodo")
    .then(res => res.json())
    .then(data => {
        let filtrados = data.filter(fila => {
            let coincide = true;

            if (nombre && !fila[1].toLowerCase().includes(nombre)) coincide = false;
            if (curso && !fila[3].toLowerCase().includes(curso)) coincide = false;

            if (desde && new Date(fila[4]) < new Date(desde)) coincide = false;
            if (hasta && new Date(fila[4]) > new Date(hasta)) coincide = false;

            return coincide;
        });
        mostrarTabla(filtrados);
    });
}

function exportarExcel() {
    window.location.href = SCRIPT_URL_VERIFICAR_QR + "?accion=exportarExcel";
}

cargarDatos();