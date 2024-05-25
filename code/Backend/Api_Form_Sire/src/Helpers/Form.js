import {ObtenerUsuarioPorID} from "../Models/ModelReserva.js";


export const obtenerDiaDeLaSemana = (fecha) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[new Date(fecha).getDay()];
}


export const validarUsuario = async (id, correo) =>{
    const validacioncorreo = await ObtenerUsuarioPorID(id);
    if(validacioncorreo.Correo !== correo){
        throw new Error ('Verifique su código institucional')
    }
}