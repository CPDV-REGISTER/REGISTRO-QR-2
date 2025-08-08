function cargarDatosUsuario() {
    fetch(SCRIPT_URL_VERIFICAR_QR + "?accion=obtenerTodo")
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector("#tablaDatos tbody");
        tbody.innerHTML = "";
        data.forEach(fila => {
            const tr = document.createElement("tr");
            const tdNombre = document.createElement("td");
            const tdCurso = document.createElement("td");
            const tdIngreso = document.createElement("td");

            tdNombre.textContent = fila[1];
            tdCurso.textContent = fila[3];
            tdIngreso.textContent = fila[6] || "Sin ingreso";

            tr.appendChild(tdNombre);
            tr.appendChild(tdCurso);
            tr.appendChild(tdIngreso);
            tbody.appendChild(tr);
        });
    });
}

cargarDatosUsuario();