import {conectar} from "../Config/ConfigDB.js";



export const getallEspacios = () => {
    const consulta = `SELECT * FROM Espacio ORDER BY Salon`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const getallBloques = (Campus) => {
    const consulta = `SELECT DISTINCT Bloque FROM Espacio Where Campus = ? ORDER BY Bloque`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [Campus], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}
export const getaEspaciosDis = () => {
    const consulta = `SELECT * FROM Espacio WHERE Disponibilidad = '1' ORDER BY Salon`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const getaEspaciosNo = () => {
    const consulta = `SELECT * FROM Espacio WHERE Disponibilidad = '0' ORDER BY Salon`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const getAuxiliaresAsig = () => {
    const consulta = `
        SELECT
            Usuario.Nombre,
            Usuario.ID_User,
            'Asignado' as Estado,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'ID_Asignacion_Bloque', A.ID_Asignacion_Bloque,
                    'Bloque_L_V', A.Bloque_L_V,
                    'Bloque_S', A.Bloque_S,
                    'Lunes', A.Lunes,
                    'Martes', A.Martes,
                    'Miércoles', A.Miércoles,
                    'Jueves', A.Jueves,
                    'Viernes', A.Viernes,
                    'Sábado', A.Sábado
                )
            ) AS Asignaciones
        FROM AsignacionesBloques AS A
        JOIN Usuario ON A.ID_User = Usuario.ID_User
        GROUP BY Usuario.ID_User
    `;

    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}


export const getAuxiliaresNoAsig = () => {
    const consulta = `SELECT U.ID_User, U.Nombre, 'Sin asignación' AS Estado
        FROM Usuario as U
        WHERE U.Rol = 'Aux_Administrativo'
        AND NOT EXISTS (
        SELECT 1
        FROM AsignacionesBloques
        WHERE U.ID_User = AsignacionesBloques.ID_User)
        ORDER BY U.Nombre;`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const getAllTodosAux = () => {
    const consulta = `SELECT * FROM Usuario WHERE Rol = 'Aux_Administrativo' ORDER BY Nombre`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    })
}

export const getUserByID_User = (ID_User) => {
    const consulta = `SELECT * FROM Usuario WHERE ID_User = ?`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [ID_User], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const insertAux = (data) => {
    const consulta = `INSERT INTO Usuario (ID_User, Nombre, Rol) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [data.ID_User, data.Nombre, data.Rol], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const updateEspacio = (ID_Espacio, Disponibilidad) => {
    const consulta = `UPDATE Espacio
                      SET Disponibilidad = ?
                      WHERE ID_Espacio = ?`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [Disponibilidad, ID_Espacio], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const updateEstadoReserva = (ID_Reserva, Estado) => {
    const sql = 'UPDATE Reserva SET Estado = ? WHERE ID_Reserva = ?';
    return new Promise((resolve, reject) => {
        conectar.query(sql, [Estado, ID_Reserva], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

export const getallReservasAca = () => {
    const consulta = `SELECT R.ID_Reserva, U.Nombre, U2.Nombre as "Nombre_Docente", R.ID_Espacio as Espacio,
                             DATE_FORMAT(R.Fh_Ini, '%Y-%m-%d %H:%i:%s') as "Fecha_Inicio",
                             DATE_FORMAT(R.Fh_Fin, '%Y-%m-%d %H:%i:%s') as "Fecha_Fin",
                             R.Estado, R.Apr_Doc as "Aprobación_Docente", R.Motivo, R.Aforo
                      FROM Reserva as R
                               JOIN Usuario as U ON R.ID_User = U.ID_User
                               JOIN AsignacionesMaterias as A ON R.ID_Prof_Mat = A.ID_Asignacion
                               JOIN Usuario AS U2 ON A.ID_User = U2.ID_User
                      Where Apr_Doc = 'Aprobada' and Estado = 'Pendiente'`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                console.log(error.message);
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const getallReservasNAca = () => {
    const consulta = `SELECT R.ID_Reserva, U.Nombre, R.ID_Espacio as Espacio,
                             DATE_FORMAT(R.Fh_Ini, '%Y-%m-%d %H:%i:%s') as "Fecha_Inicio",
                             DATE_FORMAT(R.Fh_Fin, '%Y-%m-%d %H:%i:%s') as "Fecha_Fin",
                             R.Estado, R.Motivo, R.Aforo
                      FROM Reserva as R
                               JOIN Usuario as U ON R.ID_User = U.ID_User
                      Where Apr_Doc = 'Nap' and Estado = 'Pendiente'`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}


export const getallReservasAcaApro = () => {
    const consulta = `SELECT R.ID_Reserva, U.Nombre, U2.Nombre as "Nombre_Docente", R.ID_Espacio as Espacio,
                             DATE_FORMAT(R.Fh_Ini, '%Y-%m-%d %H:%i:%s') as "Fecha_Inicio",
                             DATE_FORMAT(R.Fh_Fin, '%Y-%m-%d %H:%i:%s') as "Fecha_Fin",
                             R.Estado, R.Apr_Doc as "Aprobación_Docente", R.Motivo, R.Aforo
                      FROM Reserva as R
                               JOIN Usuario as U ON R.ID_User = U.ID_User
                               JOIN AsignacionesMaterias as A ON R.ID_Prof_Mat = A.ID_Asignacion
                               JOIN Usuario AS U2 ON A.ID_User = U2.ID_User
                      Where Apr_Doc = 'Aprobada' and (Estado = 'Aprobada' OR Estado = 'Finalizada')`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                console.log(error.message);
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const getallReservasNAcaApro = () => {
    const consulta = `SELECT R.ID_Reserva, U.Nombre, R.ID_Espacio as Espacio,
                             DATE_FORMAT(R.Fh_Ini, '%Y-%m-%d %H:%i:%s') as "Fecha_Inicio",
                             DATE_FORMAT(R.Fh_Fin, '%Y-%m-%d %H:%i:%s') as "Fecha_Fin",
                             R.Estado, R.Motivo, R.Aforo
                      FROM Reserva as R
                               JOIN Usuario as U ON R.ID_User = U.ID_User
                      Where Apr_Doc = 'Nap' and (Estado = 'Aprobada' OR ESTADO = 'Finalizada')`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}


export const AsignarBloqueAux = (Auxiliar) => {
    const consulta = `INSERT INTO AsignacionesBloques (ID_Asignacion_Bloque, ID_User, Bloque_L_V, Bloque_S, Lunes,
                             Martes, Miércoles, Jueves, Viernes, Sábado)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const parametros = [
        Auxiliar.ID_Asignacion_Bloque,
        Auxiliar.ID_User,
        Auxiliar.Bloque_L_V || null,
        Auxiliar.Bloque_S || null,
        Auxiliar.Lunes || null,
        Auxiliar.Martes || null,
        Auxiliar.Miércoles || null,
        Auxiliar.Jueves || null,
        Auxiliar.Viernes || null,
        Auxiliar.Sábado || null
    ];
    return new Promise((resolve, reject) => {
        conectar.query(consulta, parametros, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
                console.log(error.message)
            } else {
                if (results.affectedRows > 0) {
                    resolve(results);
                } else {
                    reject(new Error('No se pudo insertar el registro'));
                }
            }
        });
    });
}

export const DeleteAsigAux = (ID_User) => {
    const consulta = `DELETE FROM AsignacionesBloques WHERE ID_User = ?`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [ID_User], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const DeleteAsigAuxU = (ID_Asignacion) => {
    const consulta = `DELETE FROM AsignacionesBloques WHERE ID_Asignacion_Bloque = ?`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [ID_Asignacion], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const DeleteUserAux = (ID_User) => {
    const consulta = `DELETE FROM Usuario WHERE ID_User = ?`;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [ID_User], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}

export const getEspaciosDisponiblesH = (horarios, Campus, Aforo) => {
    let consulta = `SELECT DISTINCT E.*
                    FROM Espacio E
                    WHERE E.Campus = ? AND E.Disponibilidad = 1 AND E.Capacidad >= ?`;
    let parametros = [Campus, Aforo];

    let horarioCondiciones = [];
    for (const dia in horarios) {
        if (horarios[dia]) {
            let [horaInicioSolicitada, horaFinSolicitada] = horarios[dia].split('-');
            horarioCondiciones.push(`NOT EXISTS (
                SELECT 1 FROM Horario_Clases H
                WHERE H.ID_Espacio = E.ID_Espacio
                AND H.${dia} IS NOT NULL
                AND (TIME(?) <= TIME(SUBSTRING_INDEX(H.${dia}, '-', -1))
                AND TIME(?) >= TIME(SUBSTRING_INDEX(H.${dia}, '-', 1)))
            )`);
            parametros.push(horaInicioSolicitada, horaFinSolicitada);
        }
    }

    if (horarioCondiciones.length > 0) {
        consulta += ' AND ' + horarioCondiciones.join(' AND ');
    }

    const replaceParamsInQuery = (query, params) => {
        return query.replace(/\?/g, () => `'${params.shift()}'`);
    };

    const parametrosDebug = [...parametros];
    const consultaConParametros = replaceParamsInQuery(consulta, parametrosDebug);
    console.log(consultaConParametros);

    return new Promise((resolve, reject) => {
        conectar.query(consulta, parametros, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}


export const crearClase = (clase) => {
    const consulta = `INSERT INTO Horario_Clases (ID_Horario, Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, ID_Espacio, ID_User, Fecha_inicio, Fecha_fin)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const parametros = [
        clase.ID_Horario || null,
        clase.Lunes || null,
        clase.Martes || null,
        clase.Miércoles || null,
        clase.Jueves || null,
        clase.Viernes || null,
        clase.Sábado || null,
        clase.ID_Espacio || null,
        clase.ID_User || null,
        clase.Fecha_Inicio || null,
        clase.Fecha_Fin || null
    ];
    return new Promise((resolve, reject) => {
        conectar.query(consulta, parametros, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
}


