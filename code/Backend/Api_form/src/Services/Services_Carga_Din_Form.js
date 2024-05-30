import {
    getallMaterias,
    getBloquesPorCampus, getEspaciosDisponibles,
    getEspaciosReservaPendiente,
    getProfesoresPorMateria
} from "../Models/Model_Carga_Din_Form.js";


export const obtenerTodasLasMaterias = async () => {
    const resultados = await getallMaterias();
    return resultados;
}

export const obtenerBloquesPorCampus = async (campus) => {
    const resultados = await getBloquesPorCampus(campus);
    return resultados;
}

export const obtenerProfesoresPorMateria = async (materia) => {
    const resultados = await getProfesoresPorMateria(materia);
    return resultados;
}

export const obtenerEspaciosDisponibles = async (campus, bloque, horaInicio, horaFin, fecha) => {
    const resultados = await getEspaciosDisponibles(campus, bloque, horaInicio, horaFin, fecha);
    return resultados;
}

export const obtenerEspaciosReservaPendiente = async (campus, bloque, horaInicio, horaFin, fecha) => {
    const resultados = await getEspaciosReservaPendiente(campus, bloque, horaInicio, horaFin, fecha);
    return resultados;
}
