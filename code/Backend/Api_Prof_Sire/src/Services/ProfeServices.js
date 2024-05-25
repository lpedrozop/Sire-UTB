import {
    CambiarEstadoReservaM,
    CambiarEstadoReservaR,
    ObtenerHistorialM,
    ObtenerReservas
} from "../Models/ModelProfe.js";


export const ObtenerReservasProfe = async (ID_User) => {
    try {

        const reservas = await ObtenerReservas(ID_User);
        return reservas;
    }
    catch (e) {
        throw new Error('Error al obtener las reservas asociadas al profesor. ' + e.message);
    }
}

export const ObtenerHistorialS = async (ID_User) => {
    try {

        const historial = await ObtenerHistorialM(ID_User);
        return historial;
    }
    catch (e) {
        throw new Error('Error al obtener el historial de reservas asociadas al profesor. ' + e.message);
    }
}

export const CambiarEstadoReservaS = async (ID_Reserva, estado) => {
    try {

        if (estado === 'Aprobada') {
            await CambiarEstadoReservaM(ID_Reserva, estado);
        }
        else{
            await CambiarEstadoReservaR(ID_Reserva, estado);
        }



    }
    catch (e) {
        throw new Error('Error al cambiar el estado de la reserva. ' + e.message);
    }
}