export const mostrarMensaje = (mensaje, tipo = "info") => {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: tipo === "success" ? "green" :
                        tipo === "danger"  ? "red" :
                        tipo === "warning" ? "orange" :
                        "#333"
        }
    }).showToast();
};

export const guardarStorage = (turnos) => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
};

export const cargarStorage = () => {
    return JSON.parse(localStorage.getItem("turnos")) || [];
};

export const eliminarTurno = (turnos, id) => {
    const nuevosTurnos = turnos.filter(turno => turno.id !== id);
    guardarStorage(nuevosTurnos);
    return nuevosTurnos;
};

export const atenderTurno = (turnos) => {
    turnos.shift();
    guardarStorage(turnos);
    return turnos;
};

export const vaciarTurnos = () => {
    localStorage.removeItem("turnos");
    return [];
};
