import { conectar } from "../Config/ConfigDB.js";

export const ObtenerReservas = (ID_User) => {
    const consulta = `SELECT Reserva.ID_Reserva, Reserva.ID_Espacio As Aula, Reserva.Apr_Doc As Estado, Reserva.Tipo_Res As "Tipo de reserva", Reserva.Motivo, Usuario.Nombre As Estudiante,
                             Materia.Nom_Materia As Materia
                      FROM Reserva
                               JOIN AsignacionesMaterias ON Reserva.ID_Prof_Mat = AsignacionesMaterias.ID_Asignacion
                               JOIN Usuario ON Reserva.ID_User = Usuario.ID_User
                               JOIN Materia on AsignacionesMaterias.ID_Materia = Materia.ID_Materia
                      WHERE AsignacionesMaterias.ID_User = ? AND Apr_Doc = 'Pendiente';
    `;
    return new Promise((resolve, reject) => {
        conectar.query(consulta,[ID_User], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}

export const ObtenerHistorialM = (ID_User) => {
    const consulta = `SELECT Reserva.ID_Reserva, Reserva.ID_Espacio As Aula, Reserva.Apr_Doc As Estado, Reserva.Tipo_Res As "Tipo de reserva", Reserva.Motivo, Usuario.Nombre As Estudiante,
                             Materia.Nom_Materia As Materia
                      FROM Reserva
                               JOIN AsignacionesMaterias ON Reserva.ID_Prof_Mat = AsignacionesMaterias.ID_Asignacion
                               JOIN Usuario ON Reserva.ID_User = Usuario.ID_User
                               JOIN Materia on AsignacionesMaterias.ID_Materia = Materia.ID_Materia
                      WHERE AsignacionesMaterias.ID_User = ? AND ( Apr_Doc = 'Aprobada' OR Apr_Doc = 'Rechazada' OR Apr_Doc = 'Cancelada');
    `;
    return new Promise((resolve, reject) => {
        conectar.query(consulta,[ID_User], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}

export const obtenerIdUsuarioPorCorreo = (Correo) => {
    const consulta = 'SELECT ID_User FROM Usuario WHERE Correo = ?';
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [Correo], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else if (results.length === 0) {
                reject('No se encontró ningún usuario con el correo especificado:', Correo);
            } else {
                resolve(results[0].ID_User);
            }
        });
    });
}


export const CambiarEstadoReservaM = (ID_Reserva, Estado) => {
    const consulta = 'UPDATE Reserva SET Apr_Doc = ? WHERE ID_Reserva = ?';
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [Estado, ID_Reserva], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}

export const CambiarEstadoReservaR = (ID_Reserva, Estado) => {
    const consulta = 'UPDATE Reserva SET Apr_Doc = ?, Estado = ? WHERE ID_Reserva = ?';
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [Estado, Estado, ID_Reserva], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta:', error);
            } else {
                resolve(results);
            }
        });
    });
}