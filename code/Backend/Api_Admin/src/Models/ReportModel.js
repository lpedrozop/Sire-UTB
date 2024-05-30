import {conectar} from "../Config/ConfigDB.js";

export const obtenerDatosClases = async () => {
    const consulta = `
        SELECT
            e.Campus,
            e.Salon,
            e.Tipo,
            COUNT(h.ID_Horario) AS Numero_Clases,
            SEC_TO_TIME(
                    SUM(
                        IFNULL(TIMESTAMPDIFF(SECOND, STR_TO_DATE(SUBSTRING_INDEX(h.Lunes, '-', 1), '%H:%i'), STR_TO_DATE(SUBSTRING_INDEX(h.Lunes, '-', -1), '%H:%i')), 0) +
                        IFNULL(TIMESTAMPDIFF(SECOND, STR_TO_DATE(SUBSTRING_INDEX(h.Martes, '-', 1), '%H:%i'), STR_TO_DATE(SUBSTRING_INDEX(h.Martes, '-', -1), '%H:%i')), 0) +
                        IFNULL(TIMESTAMPDIFF(SECOND, STR_TO_DATE(SUBSTRING_INDEX(h.Miércoles, '-', 1), '%H:%i'), STR_TO_DATE(SUBSTRING_INDEX(h.Miércoles, '-', -1), '%H:%i')), 0) +
                        IFNULL(TIMESTAMPDIFF(SECOND, STR_TO_DATE(SUBSTRING_INDEX(h.Jueves, '-', 1), '%H:%i'), STR_TO_DATE(SUBSTRING_INDEX(h.Jueves, '-', -1), '%H:%i')), 0) +
                        IFNULL(TIMESTAMPDIFF(SECOND, STR_TO_DATE(SUBSTRING_INDEX(h.Viernes, '-', 1), '%H:%i'), STR_TO_DATE(SUBSTRING_INDEX(h.Viernes, '-', -1), '%H:%i')), 0) +
                        IFNULL(TIMESTAMPDIFF(SECOND, STR_TO_DATE(SUBSTRING_INDEX(h.Sábado, '-', 1), '%H:%i'), STR_TO_DATE(SUBSTRING_INDEX(h.Sábado, '-', -1), '%H:%i')), 0)
                    )
            ) AS Horas_Util
        FROM
            Horario_Clases h
                JOIN
            Espacio e ON h.ID_Espacio = e.ID_Espacio
        GROUP BY
            e.Campus, e.Salon, e.Tipo
        ORDER BY
            Horas_Util DESC;
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
};

export const obtenerDatosReservas = async (fechaInicio, fechaFin) => {
    const consulta = `
        SELECT
            e.Campus,
            e.Salon,
            e.Tipo,
            SUM(CASE WHEN r.Estado = 'Pendiente' THEN 1 ELSE 0 END) AS Numero_Reservas_Pendientes,
            SUM(CASE WHEN r.Estado = 'Aprobada' THEN 1 ELSE 0 END) AS Numero_Reservas_Aprobadas,
            SUM(CASE WHEN r.Estado = 'Rechazada' THEN 1 ELSE 0 END) AS Numero_Reservas_Rechazadas,
            COUNT(r.ID_Reserva) AS Total_Reservas,
            SEC_TO_TIME(SUM(
                    CASE WHEN r.Estado = 'Aprobada'
                             THEN TIMESTAMPDIFF(SECOND, r.Fh_Ini, r.Fh_Fin)
                         ELSE 0
                        END
                        )) AS Horas_Utilizadas
        FROM
            Reserva r
                JOIN
            Espacio e ON r.ID_Espacio = e.ID_Espacio
        WHERE
            r.Estado <> 'Cancelada'
          AND DATE(r.Fh_Ini) >= ?
          AND DATE(r.Fh_Fin) <= ?
          AND (r.Apr_Doc = 'Aprobada' OR r.Apr_Doc = 'Nap')
        GROUP BY
            e.Campus, e.Salon, e.Tipo
        ORDER BY
            Total_Reservas DESC;
    `;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [fechaInicio, fechaFin], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
};

export const NumeroReservas = async (fechaInicio, fechaFin) => {
    const consulta = `
        SELECT
            u.Rol,
            u.Nombre,
            SUM(CASE WHEN r.Estado = 'Pendiente' THEN 1 ELSE 0 END) AS Numero_Reservas_Pendientes,
            SUM(CASE WHEN r.Estado = 'Aprobada' THEN 1 ELSE 0 END) AS Numero_Reservas_Aprobadas,
            SUM(CASE WHEN r.Estado = 'Rechazada' THEN 1 ELSE 0 END) AS Numero_Reservas_Rechazadas,
            COUNT(r.ID_Reserva) AS Total_Reservas
        FROM
            Usuario u
                JOIN
            Reserva r ON u.ID_User = r.ID_User
        WHERE
            DATE(r.Fh_Ini) >= ?
          AND DATE(r.Fh_Fin) <= ?
          AND (r.Apr_Doc = 'Aprobada' OR r.Apr_Doc = 'Nap')
          AND r.Estado <> 'Cancelada'
        GROUP BY
            u.ID_User, u.Rol, u.Nombre
        HAVING
            COUNT(r.ID_Reserva) > 0
        ORDER BY
            Numero_Reservas_Aprobadas desc;

    `;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [fechaInicio, fechaFin], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
};


export const HorasTrabajadasAux = async (fechaInicio, fechaFin) => {
    const consulta = `
        SELECT
            u.ID_User,
            u.Nombre,

            SEC_TO_TIME(
                    SUM(
                                IFNULL(
                                        TIME_TO_SEC(
                                                TIMEDIFF(
                                                        STR_TO_DATE(SUBSTRING_INDEX(Lunes, '-', -1), '%H:%i'),
                                                        STR_TO_DATE(SUBSTRING_INDEX(Lunes, '-', 1), '%H:%i')
                                                )
                                        ), 0
                                ) +
                                IFNULL(
                                        TIME_TO_SEC(
                                                TIMEDIFF(
                                                        STR_TO_DATE(SUBSTRING_INDEX(Martes, '-', -1), '%H:%i'),
                                                        STR_TO_DATE(SUBSTRING_INDEX(Martes, '-', 1), '%H:%i')
                                                )
                                        ), 0
                                ) +
                                IFNULL(
                                        TIME_TO_SEC(
                                                TIMEDIFF(
                                                        STR_TO_DATE(SUBSTRING_INDEX(Miércoles, '-', -1), '%H:%i'),
                                                        STR_TO_DATE(SUBSTRING_INDEX(Miércoles, '-', 1), '%H:%i')
                                                )
                                        ), 0
                                ) +
                                IFNULL(
                                        TIME_TO_SEC(
                                                TIMEDIFF(
                                                        STR_TO_DATE(SUBSTRING_INDEX(Jueves, '-', -1), '%H:%i'),
                                                        STR_TO_DATE(SUBSTRING_INDEX(Jueves, '-', 1), '%H:%i')
                                                )
                                        ), 0
                                ) +
                                IFNULL(
                                        TIME_TO_SEC(
                                                TIMEDIFF(
                                                        STR_TO_DATE(SUBSTRING_INDEX(Viernes, '-', -1), '%H:%i'),
                                                        STR_TO_DATE(SUBSTRING_INDEX(Viernes, '-', 1), '%H:%i')
                                                )
                                        ), 0
                                ) +
                                IFNULL(
                                        TIME_TO_SEC(
                                                TIMEDIFF(
                                                        STR_TO_DATE(SUBSTRING_INDEX(Sábado, '-', -1), '%H:%i'),
                                                        STR_TO_DATE(SUBSTRING_INDEX(Sábado, '-', 1), '%H:%i')
                                                )
                                        ), 0
                                )
                    )
            ) AS Total_Horas_Trabajo
        FROM
            Usuario u
                JOIN
            AsignacionesBloques ab ON u.ID_User = ab.ID_User
        GROUP BY
            u.ID_User, u.Nombre
        ORDER BY
            Total_Horas_Trabajo DESC;
    `;
    return new Promise((resolve, reject) => {
        conectar.query(consulta, [fechaInicio, fechaFin], (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
};

export const DashboardFiltro = async (fechaInicio, fechaFin, estados) => {

    // Construir la lista de placeholders para los estados en la consulta SQL
    const estadosPlaceholders = estados.map(() => '?').join(', ');

    const consulta = `
        SELECT
            r.ID_User AS ID_Reservante,
            u.Nombre AS Nombre_Reservante,
            r.ID_Espacio AS Aula,
            r.Tipo_Res,
            DATE(r.Fh_Ini) AS Fecha_Inicio,
            DATE(r.Fh_Fin) AS Fecha_Fin,
            r.Estado,
            r.Motivo,
            r.Aforo,
            am.ID_User AS ID_Docente,
            u2.Nombre AS Nombre_Docente,
            r.Apr_Doc AS Aprobacion_Docente
        FROM
            Reserva r
                JOIN
            Usuario u ON r.ID_User = u.ID_User
                LEFT JOIN
            AsignacionesMaterias am ON r.ID_Prof_Mat = am.ID_Asignacion
                LEFT JOIN
            Usuario u2 ON am.ID_User = u2.ID_User
        WHERE
            DATE(r.Fh_Ini) >= ? AND DATE(r.Fh_Fin) <= ? 
          AND
            r.Apr_Doc IN ('Aprobada', 'Nap') 
          AND
            r.Estado IN (${estadosPlaceholders})
          AND
            r.Estado <> 'Cancelada'
        ORDER BY
            r.Fh_Ini;
    `;

    const params = [fechaInicio, fechaFin, ...estados];

    return new Promise((resolve, reject) => {
        conectar.query(consulta, params, (error, results) => {
            if (error) {
                reject('Error al ejecutar la consulta: ' + error.message);
            } else {
                resolve(results);
            }
        });
    });
};
