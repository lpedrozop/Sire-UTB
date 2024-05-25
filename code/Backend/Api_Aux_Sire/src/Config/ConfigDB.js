import mysql from 'mysql2'
import {
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,
} from "./Config.js";

const conectar = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE,
})


conectar.getConnection((err, connection) =>{
    if(err){
        console.error(('Error en la conexión a la base de datos '+ err.stack))
        return;
    }
    console.log('Conexión Exitosa')


})

export {conectar}

