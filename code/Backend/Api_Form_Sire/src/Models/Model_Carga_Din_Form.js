import {conectar} from "../Config/ConfigDB.js";

export const getallMaterias = () => {
    const consulta = 'SELECT Nom_Materia FROM Materia order by Nom_Materia';
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}

export const getBloquesPorCampus = (campus) => {
    const consulta = 'SELECT DISTINCT Bloque FROM Espacio WHERE Campus = ?';
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [campus], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}

export const getProfesoresPorMateria = (materia) => {
    const consulta = `
        SELECT DISTINCT Usuario.Nombre 
        FROM Usuario 
        JOIN AsignacionesMaterias ON Usuario.ID_User = AsignacionesMaterias.ID_User 
        JOIN Materia ON AsignacionesMaterias.ID_Materia = Materia.ID_Materia 
        WHERE Materia.Nom_Materia = ? ORDER BY Usuario.Nombre`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [materia], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}


export const getEspaciosDisponibles = (campus, bloque, horaInicio, horaFin, fecha) => {
    const consulta = `
        SELECT Salon, Tipo, Capacidad, Equipos_Tec FROM Espacio
        WHERE Campus = ? AND Bloque = ? AND Disponibilidad = 1
        AND NOT EXISTS (
            SELECT 1 FROM Horario_Clases
            WHERE Espacio.ID_Espacio = Horario_Clases.ID_Espacio
            AND (
                (DAYNAME(?) = 'Monday' AND Lunes IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Lunes, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Lunes, '-', 1), '%H:%i'))) OR
                (DAYNAME(?) = 'Tuesday' AND Martes IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Martes, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Martes, '-', 1), '%H:%i'))) OR
                (DAYNAME(?) = 'Wednesday' AND Miércoles IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Miércoles, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Miércoles, '-', 1), '%H:%i'))) OR
                (DAYNAME(?) = 'Thursday' AND Jueves IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Jueves, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Jueves, '-', 1), '%H:%i'))) OR
                (DAYNAME(?) = 'Friday' AND Viernes IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Viernes, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Viernes, '-', 1), '%H:%i'))) OR
                (DAYNAME(?) = 'Saturday' AND Sábado IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Sábado, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Sábado, '-', 1), '%H:%i'))) OR
                (DAYNAME(?) = 'Sunday' AND Domingo IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Domingo, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Domingo, '-', 1), '%H:%i')))
            )
        )
        AND 
            NOT EXISTS (
            SELECT 1
            FROM Reserva
            WHERE Espacio.ID_Espacio = Reserva.ID_Espacio
            AND DATE(Fh_Ini) = ?
            AND (TIME(Fh_Fin) >= ? AND TIME(Fh_Ini) <= ?)
            AND (Estado = 'Pendiente' OR Estado = 'Aprobada')
        )`;

    const parametros = [
        campus, bloque,
        fecha, horaInicio, horaFin,
        fecha, horaInicio, horaFin,
        fecha, horaInicio, horaFin,
        fecha, horaInicio, horaFin,
        fecha, horaInicio, horaFin,
        fecha, horaInicio, horaFin,
        fecha, horaInicio, horaFin,
        fecha, horaInicio, horaFin,
        fecha, horaInicio, horaFin,
    ];

    return new Promise((resolve, reject) => {
        conectar.query(consulta, parametros, (error, results) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export const getEspaciosReservaPendiente = (campus, bloque, horaInicio, horaFin, fecha) => {
    const consulta = `
        SELECT Salon, Tipo, Capacidad, Equipos_Tec FROM Espacio
        WHERE Campus = ? AND Bloque = ? AND Disponibilidad = 1
        AND EXISTS (
            SELECT 1 FROM Reserva
            WHERE Espacio.ID_Espacio = Reserva.ID_Espacio
            AND Estado = 'Pendiente'
            AND DATE(Fh_Ini) = ? AND (TIME(Fh_Ini) <= ? AND TIME(Fh_Fin) >= ?)
        )`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [campus, bloque, fecha, horaFin, horaInicio], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}