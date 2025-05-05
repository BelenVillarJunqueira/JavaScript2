let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
let turnoEditandoId = null;

const renderTurnos = () => {
    const lista = document.getElementById("listaTurnos");
    lista.innerHTML = "";

    turnos.forEach((turno) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${turno.nombre}</strong> - ${turno.especialidad}<br>
            DNI: ${turno.dni} | Edad: ${turno.edad}<br>
            Fecha: ${turno.fecha} | Hora: ${turno.hora}<br>
            <button class="btn btn-danger btn-sm" onclick="eliminarTurno('${turno.id}')">Eliminar</button>
        `;

        const btnEditar = document.createElement("button");
        btnEditar.innerText = "Editar";
        btnEditar.classList.add("btn", "btn-sm", "btn-warning", "ms-2");
        btnEditar.addEventListener("click", () => editarTurno(turno.id));
        li.appendChild(btnEditar);
        lista.appendChild(li);
    });
};

const mostrarMensaje = (mensaje, tipo = "warning") => {
    const divMensaje = document.getElementById("mensaje");
    divMensaje.textContent = mensaje;
    divMensaje.className = `alert alert-${tipo}`;
    divMensaje.style.display = "block";
    setTimeout(() => divMensaje.style.display = "none", 3000);
};

const guardarStorage = () => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
};

const validarNumeroPositivo = (valor) => Number.isInteger(valor) && valor > 0;

const editarTurno = (id) => {
    const turno = turnos.find(t => t.id === id);
    if (!turno) return;

    document.getElementById("nombre").value = turno.nombre;
    document.getElementById("edad").value = turno.edad;
    document.getElementById("dni").value = turno.dni;
    document.getElementById("direccion").value = turno.direccion;
    document.getElementById("telefono").value = turno.telefono;
    document.getElementById("especialidad").value = turno.especialidad;
    document.getElementById("fecha").value = turno.fecha;
    document.getElementById("hora").value = turno.hora;

    editarTurno(id);
    mostrarMensaje("Modificá los datos y vuelve a guardar el turno.", "info");
};

const sacarTurno = (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const dni = document.getElementById("dni").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const especialidad = document.getElementById("especialidad").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    if (!nombre || !edad || !dni || !direccion || !telefono || !especialidad || !fecha || !hora) {
        mostrarMensaje("Todos los campos son obligatorios");
        return;
    }

    if (edad <= 0 || dni <= 0) {
        mostrarMensaje("Edad y DNI no son validos");
        return;
    }


    const esTurnoDuplicado = (nuevoTurno) => {
        return turnos.some(
            (t) =>
            t.nombre.trim().toLowerCase() === nuevoTurno.nombre.trim().toLowerCase() &&
            t.dni === nuevoTurno.dni &&
            t.fecha === nuevoTurno.fecha &&
            t.hora === nuevoTurno.hora &&
            t.especialidad === nuevoTurno.especialidad 
            
        );
    };

    if (turnoEditandoId) {
        const index = turnos.findIndex((t) => t.id === turnoEditandoId);
        if (index !== 1) {
            turnos[index] = {
                id: turnoEditandoId,
                nombre,
                edad,
                dni,
                direccion,
                telefono,
                especialidad,
                fecha,
                hora,
            };
        }
        turnoEditandoId = null;
    } else {}
    const nuevoTurno = {
        id: crypto.randomUUID(),
        nombre,
        edad,
        dni,
        direccion,
        telefono,
        especialidad,
        fecha,
        hora
    };

    turnos.push(nuevoTurno);
    guardarStorage();
    renderTurnos();
    document.getElementById("formTurno").reset();
    mostrarMensaje("Turno guardado correctamente", "success");
};


const eliminarTurno = (id) => {
    turnos = turnos.filter(turno => turno.id !== id);
    guardarStorage();
    renderTurnos();
    mostrarMensaje("Turno eliminado", "success");
};

const atenderTurno = () => {
    if (turnos.length === 0) return;
    turnos.shift();
    guardarStorage();
    renderTurnos();
    mostrarMensaje("Turno atendido", "success");
};

const vaciarTurnos = () => {
    turnos = [];
    localStorage.removeItem("turnos");
    renderTurnos();
    mostrarMensaje("Todos los turnos fueron eliminados", "danger");
};

document.addEventListener("DOMContentLoaded", () => {
    renderTurnos();
    document.getElementById("formTurno").addEventListener("submit", sacarTurno);
    document.getElementById("atenderTurno").addEventListener("click", atenderTurno);
    document.getElementById("vaciarTurnos").addEventListener("click", vaciarTurnos);
});

renderTurnos();