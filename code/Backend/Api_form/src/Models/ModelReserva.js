import { conectar } from '../Config/ConfigDB.js';

export const crearReserva = (reserva) => {

    const consulta = `
        INSERT INTO Reserva (ID_Reserva, ID_User, ID_Espacio, Tipo_Res, Fh_Ini, Fh_Fin, Estado, Apr_Doc, Motivo, Aforo, ID_Prof_Mat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [reserva.ID_Reserva, reserva.ID_User, reserva.ID_Espacio, reserva.Tipo_Res, reserva.Fh_Ini, reserva.Fh_Fin, reserva.Estado, reserva.Apr_Doc, reserva.Motivo, reserva.Capacidad, reserva.ID_Prof_Mat], (error, results) => {
            if (error) {
                //console.error('Error al ejecutar la consulta:', error);
                const newError = new Error('Error al ejecutar la consulta: ' + error.message);
                newError.code = error.code;
                reject(newError);

            } else {
                console.log('Resultados de la consulta:', results);
                resolve(results);
            }
        });
    });
}

export const ObtenerReserva = (ID_Reserva) => {
    const consulta = ` SELECT ID_Espacio, Fh_Ini, Fh_Fin FROM Reserva WHERE ID_Reserva = ?`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [ID_Reserva], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}
export const obtenerIdAsignacionPorMateriaYProfesor = (Materia, Nombre_Prof) => {
    const consulta = `
        SELECT AsignacionesMaterias.ID_Asignacion 
        FROM AsignacionesMaterias 
        JOIN Materia ON AsignacionesMaterias.ID_Materia = Materia.ID_Materia 
        JOIN Usuario ON AsignacionesMaterias.ID_User = Usuario.ID_User 
        WHERE Materia.Nom_Materia = ? AND Usuario.Nombre = ?`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [Materia, Nombre_Prof], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results[0].ID_Asignacion);
            }
        });
    });
}
export const obtenerCorreoProfesorPorIdProfMat = (idProfMat) => {
    const consulta = `
        SELECT Usuario.Correo
        FROM Usuario
        JOIN AsignacionesMaterias ON Usuario.ID_User = AsignacionesMaterias.ID_User
        WHERE AsignacionesMaterias.ID_Asignacion = ?`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [idProfMat], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results[0].Correo);
            }
        });
    });
}


export const verificarReservaExistente = (ID_User, Fh_Ini, Fh_Fin) => {
    const consulta = `
        SELECT COUNT(*) as count
        FROM Reserva
        WHERE ID_User = ? AND Estado != 'Cancelada' AND Apr_Doc != 'Cancelada' AND ((Fh_Ini <= ? AND Fh_Fin > ?) OR (Fh_Ini < ? AND Fh_Fin >= ?) OR (Fh_Ini >= ? AND Fh_Fin <= ?))`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [ID_User, Fh_Ini, Fh_Ini, Fh_Fin, Fh_Fin, Fh_Ini, Fh_Fin], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results[0].count > 0);
            }
        });
    });
}

export const verificarClaseExistente = (ID_Prof_Mat, Dia, Hora_Inicio, Hora_Fin) => {
    const consulta = `
        SELECT COUNT(*) as count
        FROM Horario_Clases
        WHERE ID_Asignacion = ? AND
        (
            (? = 'Lunes' AND Lunes IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Lunes, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Lunes, '-', 1), '%H:%i'))) OR
            (? = 'Martes' AND Martes IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Martes, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Martes, '-', 1), '%H:%i'))) OR
            (? = 'Miércoles' AND Miércoles IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Miércoles, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Miércoles, '-', 1), '%H:%i'))) OR
            (? = 'Jueves' AND Jueves IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Jueves, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Jueves, '-', 1), '%H:%i'))) OR
            (? = 'Viernes' AND Viernes IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Viernes, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Viernes, '-', 1), '%H:%i'))) OR
            (? = 'Sábado' AND Sábado IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Sábado, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Sábado, '-', 1), '%H:%i'))) OR
            (? = 'Domingo' AND Domingo IS NOT NULL AND (STR_TO_DATE(?, '%H:%i') <= STR_TO_DATE(SUBSTRING_INDEX(Domingo, '-', -1), '%H:%i') AND STR_TO_DATE(?, '%H:%i') >= STR_TO_DATE(SUBSTRING_INDEX(Domingo, '-', 1), '%H:%i')))
        )`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [ID_Prof_Mat, Dia, Hora_Inicio, Hora_Fin, Dia, Hora_Inicio, Hora_Fin, Dia, Hora_Inicio, Hora_Fin, Dia, Hora_Inicio, Hora_Fin, Dia, Hora_Inicio, Hora_Fin, Dia, Hora_Inicio, Hora_Fin, Dia, Hora_Inicio, Hora_Fin], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results[0].count > 0);
            }
        });
    });
}


export const cancelarReserva = (ID_Reserva) => {
    const consulta = 'UPDATE Reserva SET Estado = ?, Apr_Doc = ? WHERE ID_Reserva = ?';
    return new Promise((resolve, reject) => {
        conectar.query(consulta, ["Cancelada", "Cancelada", ID_Reserva], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    });
}

export const obtenerReservasPorUsuario = (ID_User) => {
    const consulta = 'SELECT * FROM Reserva WHERE ID_User = ?';
    return new Promise ((resolve, reject) =>{
        conectar.query(consulta, [ID_User], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta', error);
            } else {
                resolve(results);
            }
        });
    });
}

export const ObtenerIdUsuarioPorCorreo = (Correo) => {
    const consulta = 'SELECT ID_User FROM Usuario WHERE Correo = ?';
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [Correo], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results[0].ID_User);
            }
        });
    });
}

export const ObtenerUsuarioPorID = (ID_User) => {
    const consulta = 'SELECT Correo FROM Usuario WHERE ID_User = ?';
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [ID_User], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

