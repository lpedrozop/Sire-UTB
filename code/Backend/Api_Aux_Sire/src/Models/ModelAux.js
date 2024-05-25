import { conectar } from '../Config/ConfigDB.js';

export const getAssignedBlocksAndHours = (ID_User, dayOfWeek, blockColumn) => {
  console.log(ID_User, dayOfWeek, blockColumn);
  return new Promise((resolve, reject) => {
    conectar.query(
        `SELECT ${blockColumn} AS Bloque, ${dayOfWeek} AS Horas FROM AsignacionesBloques WHERE ID_User = ? AND ${blockColumn} IS NOT NULL AND ${dayOfWeek} IS NOT NULL`,
        [ID_User],
        (err, results) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            reject(err); // Rechazar la promesa con el error
          } else {
            if (results && results.length > 0) {
              resolve(results); // Resolver la promesa con el arreglo de resultados
            } else {
              resolve([]); // Resolver la promesa con un arreglo vacío si no hay resultados
            }
          }
        }
    );
  });
};

export const getAssignedClassesWithUserName = (dayOfWeek, startTime, endTime, Bloque) => {
  console.error("Modelo Auxiliar")
  console.log(dayOfWeek, startTime, endTime, Bloque)
  const sql = `
    SELECT U.Nombre, H.ID_Espacio, H.${dayOfWeek} AS Horas, H.ID_Horario
    FROM Horario_Clases AS H
    JOIN AsignacionesMaterias AS A ON H.ID_Asignacion = A.ID_Asignacion
    JOIN Usuario AS U ON A.ID_User = U.ID_User
    WHERE H.Viernes IS NOT NULL 
    AND TIME_TO_SEC(SUBSTRING_INDEX(${dayOfWeek}, '-', 1)) >= TIME_TO_SEC(?)
    AND TIME_TO_SEC(SUBSTRING_INDEX(${dayOfWeek}, '-', -1)) <= TIME_TO_SEC(?)
    AND H.ID_Espacio LIKE ?
    ORDER BY H.${dayOfWeek};
  `;

  console.log("SQL query:", sql);
  console.log("Parameters:", [startTime, endTime, `${Bloque}-%`]);

  return new Promise((resolve, reject) => {
    conectar.query(sql, [startTime, endTime, `${Bloque}-%`], (err, results) => {
      if (err) {
        console.error("SQL error:", err);
        reject(err);
        return;
      }
      console.log("SQL results:", results);
      if (results.length > 0) {
        resolve(results); // Retorna un array de resultados
      } else {
        resolve([]); // Retorna un array vacío si no hay resultados
      }
    });
  });
};

export const getReservedSpaces = (Bloque, startTime, endTime) => {
  console.log(Bloque, startTime, endTime)
  const sql = `
    SELECT U.Nombre, R.ID_Reserva,R.ID_User,R.ID_Espacio,R.Tipo_Res,R.Estado,R.Apr_Doc,R.Motivo,R.Aforo,R.ID_Prof_Mat,
       CONVERT_TZ(R.Fh_Ini, @@session.time_zone, '-05:00') AS Fh_Ini,
        CONVERT_TZ(R.Fh_Fin, @@session.time_zone, '-05:00') AS Fh_Fin
    FROM Reserva AS R
    JOIN Usuario AS U ON R.ID_User = U.ID_User
    WHERE R.ID_Espacio LIKE ?
    AND R.Estado = 'Aprobada'
    AND (R.Apr_Doc = 'Aprobada' OR R.Apr_Doc = 'Nap')
    AND R.Fh_Ini >= ?
    AND R.Fh_Fin <= ?
  `;

  console.log("SQL query:", sql);
  console.log("Parameters:", [`${Bloque}-%`, startTime, endTime]);

  return new Promise((resolve, reject) => {
    conectar.query(sql, [`${Bloque}-%`, startTime, endTime], (err, results) => {
      if (err) {
        console.error("SQL error:", err);
        reject(err);
        return;
      }
      console.log("SQL results:", results);
      if (results.length > 0) {
        resolve(results);
      } else {
        resolve([]);
      }
    });
  });
};

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

export const InsertReport = (datatoreport) => {
  const { ID_Reporte, ID_User, ID_Reserva = null, ID_Horario = null, Fh_Reporte, Pre_Reporte, Descripcion } = datatoreport;
  const sql = 'INSERT INTO Reporte (ID_Reporte, ID_User, ID_Reserva, ID_Horario, Fh_Reporte, Pre_Reporte, Descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    conectar.query(sql, [ID_Reporte, ID_User, ID_Reserva, ID_Horario,
      Fh_Reporte, Pre_Reporte, Descripcion], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

export const CambiarEstadoFinalizada = (ID_Reserva) => {
    const sql = 'UPDATE Reserva SET Estado = ?, Apr_Doc = ? WHERE ID_Reserva = ?';
    return new Promise((resolve, reject) => {
        conectar.query(sql, ["Finalizada", "Finalizada", ID_Reserva], (err, results) => {
        if (err) {
            reject(err);
        } else {
            resolve(results);
        }
        });
    });
}
