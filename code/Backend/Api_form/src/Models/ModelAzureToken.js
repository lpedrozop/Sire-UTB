import {conectar} from "../Config/ConfigDB.js";

export const insertUserMetadata = (data) => {

        const sql = 'INSERT INTO Usuario (ID_User, Nombre, Correo, Rol) VALUES (?, ?, ?, ?)';

        return new Promise((resolve, reject) => {
            conectar.query(sql, [data.ID_Usuario, data.Nombre, data.Correo, data.Rol], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
}

export const getUserByNombre = async (Nombre) => {
    const sql = 'SELECT Nombre FROM Usuario WHERE Nombre = ?';

    return new Promise((resolve, reject) => {
        conectar.query(sql, [Nombre], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            if (results.length > 0) {
                resolve(results[0]);
            } else {
                resolve(null);
            }
        });
    });
}

export const getCorreoUser = (Correo) => {
    const sql = 'SELECT Correo FROM Usuario WHERE Correo = ?';

    return new Promise((resolve, reject) => {
        conectar.query(sql, [Correo], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            if (results.length > 0) {
                resolve(results[0].Correo);
            } else {
                resolve(null);
            }
        });
    });
}


export const UpdateCorreoUser = (data) => {
    const sql = 'UPDATE Usuario SET Correo = ? WHERE Nombre = ?';

    return new Promise((resolve, reject) => {
        conectar.query(sql, [data.Correo, data.Nombre], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
        conectar.closed;
    });
}

export const UpdateIDUser = (Codigo, Correo) => {
    const sql = 'UPDATE Usuario SET ID_User = ? WHERE Correo = ?';
    return new Promise((resolve, reject) => {
        conectar.query(sql, [Codigo, Correo], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
        conectar.closed;
    });
}
