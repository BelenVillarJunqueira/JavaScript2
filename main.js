let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

const renderTurnos = () => {
    const lista = document.getElementById("listaTurnos");
    lista.innerHTML = "";


    turnos.forEach((turno, index) => {
        const li = document.createElement("li");
        li.classList.add("mb-2");
        li.innerHTML = `
            <strong>${index + 1}.</strong> ${turno.nombre} - ${turno.especialidad} 
            (DNI: ${turno.dni}) 
            <button class="btn btn-sm btn-danger float-end eliminar-btn" data-dni="${turno.dni}">
                Eliminar
            </button>`;
        lista.appendChild(li);
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const dni = e.target.getAttribute("data-dni");
            eliminarTurno(dni);
        });
    });
};

const guardarStorage = () => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
};

const sacarTurno = (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const dni = document.getElementById("dni").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const especialidad = document.getElementById("especialidad").value.trim();

    if (!nombre || !edad || !dni || !direccion || !telefono || !especialidad) return;

    const nuevoTurno = { nombre, edad, dni, direccion, telefono, especialidad };
    turnos.push(nuevoTurno);

    guardarStorage();
    renderTurnos();
    document.getElementById("formTurno").reset();
};

const atenderTurno = () => {
    if (turnos.length === 0) return;

    turnos.shift();
    guardarStorage();
    renderTurnos();
};


const eliminarTurno = (dniAEliminar) => {
    turnos = turnos.filter(turno => turno.dni !== dniAEliminar);
    guardarStorage();
    renderTurnos();
};

const vaciarTurnos = () => {
    turnos = [];
    localStorage.removeItem("turnos");
    renderTurnos();
};

document.getElementById("formTurno").addEventListener("submit", sacarTurno);
document.getElementById("atenderTurno").addEventListener("click", atenderTurno);
document.getElementById("vaciarTurnos").addEventListener("click", vaciarTurnos);


renderTurnos();