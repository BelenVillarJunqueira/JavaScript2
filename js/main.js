import {
    mostrarMensaje,
    guardarStorage,
    cargarStorage,
    eliminarTurno,
    atenderTurno,
    vaciarTurnos
} from './turnos.js';

let turnos = cargarStorage();
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
        `;

        const btnEliminar = document.createElement("button");
        btnEliminar.innerText = "Eliminar";
        btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
        btnEliminar.addEventListener("click", () => {
            turnos = eliminarTurno(turnos, turno.id);
            renderTurnos();
            mostrarMensaje("Turno eliminado", "success");
        });

        const btnEditar = document.createElement("button");
        btnEditar.innerText = "Editar";
        btnEditar.classList.add("btn", "btn-sm", "btn-warning", "ms-2");
        btnEditar.addEventListener("click", () => editarTurno(turno.id));

        li.appendChild(btnEliminar);
        li.appendChild(btnEditar);
        lista.appendChild(li);
    });
};

const cargarEspecialidades = async () => {
    try {
        const res = await fetch('./js/data/especialidades.json');
        if (!res.ok) throw new Error("No se pudieron cargar las especialidades");

        const especialidades = await res.json();
        const select = document.getElementById("especialidad");
        select.innerHTML = '<option value="">Seleccionar especialidad</option>';
        especialidades.forEach(especialidad => {
            const option = document.createElement("option");
            option.value = especialidad;
            option.textContent = especialidad;
            select.appendChild(option);
        });
    } catch (error) {
        mostrarMensaje("⚠️ Error al cargar especialidades: " + error.message, "danger");
    }
};

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

    turnoEditandoId = id;
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
        mostrarMensaje("Todos los campos son obligatorios", "danger");
        return;
    }

    const duplicado = turnos.some(turno =>
        turno.nombre.toLowerCase() === nombre.toLowerCase() &&
        turno.dni === dni &&
        turno.fecha === fecha &&
        turno.hora === hora &&
        turno.especialidad === especialidad
    );

    if (duplicado) {
        mostrarMensaje("Ya existe un turno igual para ese paciente", "danger");
        return;
    }

    if (turnoEditandoId) {
        const index = turnos.findIndex(t => t.id === turnoEditandoId);
        if (index !== -1) {
            turnos[index] = {
                id: turnoEditandoId,
                nombre, edad, dni, direccion, telefono, especialidad, fecha, hora
            };
            mostrarMensaje("Turno editado correctamente", "success");
        }
        turnoEditandoId = null;
    } else {
        const nuevoTurno = {
            id: crypto.randomUUID(),
            nombre, edad, dni, direccion, telefono, especialidad, fecha, hora
        };
        turnos.push(nuevoTurno);
        mostrarMensaje("Turno guardado correctamente", "success");
    }

    guardarStorage(turnos);
    renderTurnos();
    document.getElementById("formTurno").reset();
};

document.addEventListener("DOMContentLoaded", () => {
    renderTurnos();
    document.getElementById("formTurno").addEventListener("submit", sacarTurno);
    document.getElementById("atenderTurno").addEventListener("click", () => {
        if (turnos.length === 0) return;
        turnos = atenderTurno(turnos);
        renderTurnos();
        mostrarMensaje("Turno atendido", "success");
    });
    document.getElementById("vaciarTurnos").addEventListener("click", () => {
        turnos = vaciarTurnos();
        renderTurnos();
        mostrarMensaje("Todos los turnos fueron eliminados", "danger");
    });
});
