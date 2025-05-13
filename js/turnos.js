let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

const guardarStorage = () => {
    localStorage.setItem('turnos', JSON.stringify(turnos));
};

export const renderTurnos = () => {
    const lista = document.getElementById('listaTurnos');
    lista.innerHTML = '';

    turnos.forEach((turno) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${turno.nombre}</strong> - ${turno.especialidad} <br>
            DNI: ${turno.dni}, Fecha: ${turno.fecha}, Hora: ${turno.hora}
        `;
        lista.appendChild(li);
    });
};

export const agregarTurno = () => {
    const nombre = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const dni = document.getElementById('dni').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const especialidad = document.getElementById('especialidad').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    if (!nombre || !edad || edad <= 0 || !dni || parseInt(dni) <= 0 || !direccion || !telefono || !especialidad || !fecha || !hora) {
        alert('Todos los campos son obligatorios y deben ser válidos.');
        return;
    }

    const turnoRepetido = turnos.some(t =>
        t.nombre.trim().toLowerCase() === nombre.toLowerCase() ||
        String(t.dni).trim() === String(dni).trim() ||
        (t.fecha === fecha && t.hora === hora)
    );

    if (turnoRepetido) {
        alert('Error: Ya existe un turno con el mismo nombre, DNI o fecha y hora. Por favor, ingrese datos distintos.');
        return;
    }

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
    document.getElementById('formTurno').reset();
};


export const atenderTurno = () => {
    if (turnos.length === 0) return;
    turnos.shift();
    guardarStorage();
    renderTurnos();
};

export const vaciarTurnos = () => {
    turnos = [];
    localStorage.removeItem('turnos');
    renderTurnos();
};

export const cargarEspecialidades = async () => {
    const select = document.getElementById('especialidad');
    try {
        const res = await fetch('../data/especialidades.json');
        const especialidades = await res.json();
        especialidades.forEach(e => {
            const option = document.createElement('option');
            option.value = e;
            option.textContent = e;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar especialidades:', error);
    }
};
