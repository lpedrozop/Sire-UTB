import {
    cancelarReserva,
    crearReserva, obtenerCorreoProfesorPorIdProfMat,
    obtenerIdAsignacionPorMateriaYProfesor, ObtenerIdUsuarioPorCorreo,
    ObtenerReserva, verificarClaseExistente, verificarReservaExistente
} from "../Models/ModelReserva.js";
import { v4 as uuidv4 } from 'uuid';
import {CORREO_NOTI, RESENDGRID_API_KEY} from "../Config/Config.js";
import { Resend } from "resend";
import fs from 'fs';
import {HtmlModificado} from "../Helpers/EmailResHelpers.js";
import {obtenerDiaDeLaSemana, validarUsuario} from "../Helpers/Form.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from "path";
import {UpdateIDUser} from "../Models/ModelAzureToken.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const resend = new Resend(RESENDGRID_API_KEY);

export const realizarReserva = async (reserva, rol) => {
    const {
        Codigo,
        Nombre,
        Correo,
        Tipo_Res,
        Materia,
        Nombre_Prof,
        Bloque,
        Salon,
        Campus,
        Capacidad,
        Fecha,
        Hora_ini,
        Hora_fin,
        Motivo
    } = reserva;

    const Correom = Correo.toLowerCase();

    const reservaParaCrear = {
        ID_Reserva: uuidv4(),
        ID_User : Codigo.toUpperCase(),
        ID_Espacio: Bloque+'-'+Salon,
        Tipo_Res: Tipo_Res,
        Fh_Ini: Fecha + ' ' + Hora_ini,
        Fh_Fin: Fecha + ' ' + Hora_fin,
        Motivo: Motivo,
        Capacidad:Capacidad,
    };


    
    // Si el Tipo_Res es 'Academica', busca el ID_Asignacion y lo añade a la reserva
    if (Tipo_Res === '1') {
        console.log(rol);
        if(rol.includes('Administrador')){
            reservaParaCrear.Estado = 'Aprobada';
            reservaParaCrear.Apr_Doc = 'Nap';
        }
        else {
            reservaParaCrear.Estado='Pendiente';
            reservaParaCrear.Apr_Doc='Pendiente';
        }
        
        reservaParaCrear.ID_Prof_Mat = await obtenerIdAsignacionPorMateriaYProfesor(Materia, Nombre_Prof);
        // Obtén el ID del usuario por el correo
        const idUsuario = await ObtenerIdUsuarioPorCorreo(Correom);

        // Si el usuario existe y su ID es diferente al ID de Azure, no se actualiza el ID
        if (idUsuario && idUsuario === Codigo) {
            console.log('El usuario ya existe y su ID es diferente al ID de Azure. No se actualiza el ID')
            await validarUsuario(idUsuario, Correom);
        } else {
            // Si el usuario no existe o su ID es el ID de Azure, actualiza el ID
            try {
                await UpdateIDUser(Codigo, Correom);
            } catch (error) {
                switch (error.code) {
                    case 'ER_ROW_IS_REFERENCED_2':
                    case 'ER_ROW_IS_REFERENCED':
                        throw new Error('El código del usuario no existe. Por favor, verifica e intenta de nuevo.');
                    default:
                        // Si el error es debido a otra cosa, simplemente lanza el error original
                        throw error;
                }
            }
        }
    }
    else {
        console.log(rol);
        if(rol.includes('Administrador')){
            reservaParaCrear.Estado = 'Aprobada';
            reservaParaCrear.Apr_Doc = 'Nap';
        }
        else {
            reservaParaCrear.Estado = 'Pendiente';
            reservaParaCrear.Apr_Doc = 'Nap';
        }
        // Obtén el ID del usuario por el correo
        const idUsuario = await ObtenerIdUsuarioPorCorreo(Correom);
        // Si el usuario existe y su ID es diferente al ID de Azure, no se actualiza el ID
        if (idUsuario && idUsuario === Codigo) {
            console.log('El usuario ya existe y su ID es diferente al ID de Azure. No se actualiza el ID')
            await validarUsuario(idUsuario, Correom);
        } else {
            // Si el usuario no existe o su ID es el ID de Azure, actualiza el ID
            try {
                await UpdateIDUser(Codigo, Correom);
            } catch (error) {
                switch (error.code) {
                    case 'ER_ROW_IS_REFERENCED_2':
                    case 'ER_ROW_IS_REFERENCED':
                        throw new Error('El código del usuario no existe. Por favor, verifica e intenta de nuevo.');
                    default:
                        // Si el error es debido a otra cosa, simplemente lanza el error original
                        throw error;
                }
            }
        }
    }


    const reservaExistente = await verificarReservaExistente(reservaParaCrear.ID_User, reservaParaCrear.Fh_Ini, reservaParaCrear.Fh_Fin);
    console.log("Reserva existente:", reservaExistente)
    const Dia = obtenerDiaDeLaSemana(Fecha);
    const claseExistente = await verificarClaseExistente(Codigo, Dia, Hora_ini, Hora_fin);
    console.log("Clase existente:", claseExistente)
    if (reservaExistente || claseExistente) {
        console.log("Ya tienes una asignación de espacio para la fecha y hora seleccionada.")
        throw new Error('Ya tienes una asignación de espacio para la fecha y hora seleccionada');
    }


    try {
        const resultados = await crearReserva(reservaParaCrear);
        const nueva_reserva = await ObtenerReserva(reservaParaCrear.ID_Reserva);

        // Si el Tipo_Res es 'Academica (1)', envía un correo al profesor
        if (Tipo_Res === '1' && resultados.affectedRows > 0) {
            console.log('Enviando correo');
            const correoProfesor = await obtenerCorreoProfesorPorIdProfMat(reservaParaCrear.ID_Prof_Mat);
            console.log("Correo del profe", correoProfesor);
            const htmlFilePath = path.resolve(__dirname, '../Template/Send_Noti.html');
            fs.readFile(htmlFilePath, 'utf8', async (err, htmlContent) => {
                if (err) {
                    console.error('Error al leer el archivo HTML:', err);
                    return;
                }

                const valores = {
                    Nombre: Nombre,
                    Nombre_Prof: Nombre_Prof,
                    Materia: Materia,
                    Fecha: Fecha,
                    HoraInicio: Hora_ini,
                    HoraFin: Hora_fin,
                    Lugar: `${Campus} - ${Bloque} - ${Salon}`
                };
                const htmlContentModificado = HtmlModificado(htmlContent, valores);

                try {
                    const {data, error} = await resend.emails.send({
                        to: [correoProfesor],
                        from: CORREO_NOTI,
                        subject: 'Aprobación de reserva',
                        html: htmlContentModificado,
                    });

                    if (error) {
                        console.error('Error al enviar el correo electrónico:', error);
                        throw new Error('Error al enviar el correo electrónico');
                    } else {
                        console.log('Correo electrónico enviado', data);
                    }
                } catch (error) {
                    console.error('Error al enviar el correo electrónico:', error);
                    throw new Error('Error al enviar el correo electrónico');
                }
            });
        }
        return nueva_reserva;
    } catch (error) {
        switch (error.code) {
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_REFERENCED_ROW':
                throw new Error('El código del usuario no existe. Por favor, verifica e intenta de nuevo. Si el problema persiste, contacta a soporte UTB.');
            case 'ER_DUP_ENTRY':
                throw new Error('Ya existe una reserva con los mismos datos. Por favor, verifica e intenta de nuevo.');
            case 'ER_BAD_NULL_ERROR':
                throw new Error('Algunos campos necesarios están vacíos. Por favor, verifica e intenta de nuevo.');
            case 'ER_PARSE_ERROR':
                throw new Error('Hubo un error al procesar la solicitud. Por favor, intenta de nuevo más tarde.');
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_ROW_IS_REFERENCED':
                throw new Error('No se puede realizar la reserva porque el código de usuario no existe en el sistema. Por favor, verifica e intenta de nuevo.');
            default:
                    throw error;
        }
    }
}

export const realiziarCancelacionReserva = async (ID_Reserva) => {
    try{
        await cancelarReserva(ID_Reserva);
    }catch{
        throw new Error('Error al cancelar la reserva');
    }


}
