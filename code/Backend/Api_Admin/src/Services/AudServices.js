import {
    AsignarBloqueAux, crearClase,
    DeleteAsigAux, DeleteAsigAuxU,
    DeleteUserAux,
    getaEspaciosDis,
    getaEspaciosNo, getallBloques,
    getallEspacios,
    getallReservasAca, getallReservasAcaApro,
    getallReservasNAca, getallReservasNAcaApro,
    getAllTodosAux,
    getAuxiliaresAsig,
    getAuxiliaresNoAsig,
    getEspaciosDisponiblesH,
    getUserByID_User,
    insertAux,
    updateEspacio,
    updateEstadoReserva
} from "../Models/AudModel.js";
import CustomError from "../Helpers/ErrorHelpers.js";
import { v4 as uuidv4 } from 'uuid';

export const getEspacios = async () => {
    try{
        return await getallEspacios();
    }
    catch(e){
        throw new Error(e.message);
    }
}

export const getBloques = async(Campus) => {
    try{
        const bloque = await getallBloques(Campus);
        if(bloque.length > 0){
            return bloque;
        }
        else {
            throw new CustomError('No hay bloques disponibles', 204);
        }


    }
    catch(e){
        throw new Error(e.message);
    }
}

export const getEspaciosNoDisponibles = async () => {
    try{
        return await getaEspaciosNo();
    }
    catch (e){
        throw new Error(e.message);
    }
}

export const getEspaciosDisponibles = async () => {
    try{
        return await getaEspaciosDis();
    }
    catch (e){
        throw new Error(e.message);
    }
}

export const getAuxAsignados = async () => {
    try {
        const asignacionesPorUsuario = await getAuxiliaresAsig(); // Obtener las asignaciones agrupadas por usuario
        console.log(asignacionesPorUsuario)
        // Procesar el resultado para unificar las asignaciones por usuario
        const resultadoFinal = asignacionesPorUsuario.map(usuario => {
            const asignacionesAgrupadas = agruparAsignaciones(usuario.Asignaciones);

            // Crear la estructura deseada con el nombre y las asignaciones agrupadas
            return {
                Nombre: usuario.Nombre, // Nombre del usuario
                ID_User: usuario.ID_User,
                Estado: usuario.Estado, // Estado del usuario
                Asignaciones: asignacionesAgrupadas // Asignaciones agrupadas
            };
        });

        return resultadoFinal;
    } catch (error) {
        console.error('Error al obtener las asignaciones:', error);
        throw new Error('Error al obtener las asignaciones: ' + error.message);
    }
};

// Función para agrupar las asignaciones por bloques y días
const agruparAsignaciones = (asignaciones) => {
    const asignacionesAgrupadas = {};

    // Iterar sobre cada asignación
    asignaciones.forEach(asignacion => {
        const { ID_Asignacion_Bloque, Bloque_S, Bloque_L_V, Lunes, Martes, Miércoles, Jueves, Viernes, Sábado } = asignacion;

        // Determinar la clave para agrupar (usando Bloque_S o Bloque_L_V o una clave genérica si no hay ninguno)
        const clave = Bloque_S || Bloque_L_V || 'Otros';

        // Si no existe el grupo para esta clave, crearlo
        if (!asignacionesAgrupadas[clave]) {
            asignacionesAgrupadas[clave] = {
                Bloque: clave,
                Asignaciones: []
            };
        }

        // Agregar la asignación al grupo correspondiente
        asignacionesAgrupadas[clave].Asignaciones.push({
            ID_Asignacion_Bloque,
            Horarios: {
                Lunes,
                Martes,
                Miércoles,
                Jueves,
                Viernes,
                Sábado
            }
        });
    });

    return Object.values(asignacionesAgrupadas);
};
export const getAuxNoAsignados = async () => {
    try{
        return await getAuxiliaresNoAsig();
    }
    catch(e){
        throw new Error(e.message);
    }

}

export const getallAux = async () => {
    try {
        return await getAllTodosAux();
    }
    catch (e){
        throw new Error(e.message)
    }
}

export const CrearAux = async (ID_User, Nombre) => {
    try {
        const dataToInsert = {
            ID_User: ID_User.toUpperCase(),
            Nombre: Nombre.toUpperCase(),
            Rol: "Aux_Administrativo"
        };
        console.log(dataToInsert);
        const existingUser = await getUserByID_User(ID_User);

        if (existingUser.length === 0) {
            const createAux = await insertAux(dataToInsert);
            console.log(createAux);
            if(createAux && createAux.affectedRows > 0){
                return createAux;
            }
            else {
                throw new CustomError('Error al crear un nuevo usuario auxiliar', 200);
            }

        }
        else {
            throw new CustomError('El auxiliar ya existe', 200);
        }

    }
    catch (e){
        throw e;
    }

}

export const InhabilitarEsp = async (ID_Espacio, Disponibilidad) => {
    try {
        const cambiarDisponibilidad = await updateEspacio(ID_Espacio, Disponibilidad);
        console.log(cambiarDisponibilidad)
        if(cambiarDisponibilidad.affectedRows > 0){
            return cambiarDisponibilidad;
        }
        else {
            throw new CustomError('Error al inhabilitar el espacio', 200);
        }
    }
    catch (e) {
        throw e;
    }
}

export const CambiarEstadoReserva = async (ID_Reserva, Estado) => {
    try {
        const cambiarEstado = await updateEstadoReserva(ID_Reserva, Estado);
        if(cambiarEstado.affectedRows > 0){
            return cambiarEstado;
        }
        else {
            throw new CustomError('Error al cambiar el estado de la reserva', 200);
        }
    }
    catch (e) {
        throw e;
    }
}

export const getReservasAca = async () => {
    try{
        return await getallReservasAca();
    }
    catch(e){
        throw new Error(e.message);
    }
}

export const getReservasNAca = async () => {
    try{
        return await getallReservasNAca();
    }
    catch (e){
        throw new Error(e.message);
    }
}

export const getReservasAcaApro = async () => {
    try{
        return await getallReservasAcaApro();
    }
    catch(e){
        throw new Error(e.message);
    }
}

export const getReservasNAcaApro = async () => {
    try{
        return await getallReservasNAcaApro();
    }
    catch (e){
        throw new Error(e.message);
    }
}


export const asignaraux = async (Aux) => {
    const{
        ID_User,
        Bloque_L_V,
        Bloque_S,
        Lunes,
        Martes,
        Miércoles,
        Jueves,
        Viernes,
        Sábado
    } = Aux
    try {
        const AsignarAux ={
            ID_Asignacion_Bloque:uuidv4(),
            ID_User: ID_User.toUpperCase(),
            Bloque_L_V: Bloque_L_V,
            Bloque_S: Bloque_S,
            Lunes: Lunes,
            Martes: Martes,
            Miércoles: Miércoles,
            Jueves: Jueves,
            Viernes: Viernes,
            Sábado: Sábado
        }
        console.log(AsignarAux);
        const aux = await AsignarBloqueAux(AsignarAux);
        console.log("Asignacion", aux);
        if(aux && aux.affectedRows > 0){
            return aux;
        }
        else {
            throw new CustomError('Error al asignar el bloque al auxiliar', 200);
        }
    }
    catch (e){
        throw e;
    }
}

export const deleteAsignaciones = async (ID_User) => {
    try {
        const deleteAsignacion = await DeleteAsigAux(ID_User.toUpperCase());
        if(deleteAsignacion.affectedRows > 0){
            return deleteAsignacion;
        }
        else {
            throw new CustomError('Error al eliminar la asignación del auxiliar', 200);
        }
    }
    catch (e){
        throw e;
    }
}

export const deleteAsignacion = async (ID_Asignacion) => {
    try {
        const deleteAsignacion = await DeleteAsigAuxU(ID_Asignacion);
        if(deleteAsignacion.affectedRows > 0){
            return deleteAsignacion;
        }
        else {
            throw new CustomError('Error al eliminar la asignación del auxiliar', 200);
        }
    }
    catch (e){
        throw e;
    }
}

export const DeleteUsuarioAux = async (ID_User) => {
    try {
        const deleteAsignacion = await DeleteAsigAux(ID_User.toUpperCase());
        console.log(deleteAsignacion);
        if (deleteAsignacion.affectedRows > 0 || deleteAsignacion.affectedRows === 0){
            const deleteUser = await DeleteUserAux(ID_User.toUpperCase());
            if (deleteUser.affectedRows > 0) {
                return deleteUser;
            } else {
                throw new CustomError('Error al eliminar el usuario', 200);
            }
        } else {
            throw new CustomError('Error al eliminar el usuario', 200);
        }
    }
    catch (e){
        throw e;
    }

}

export const obtenerEspaciosDisponibles = async (horario, Campus, Aforo) => {
    try {
        const EspaciosD = await getEspaciosDisponiblesH(horario, Campus, Aforo)
        if(EspaciosD.length > 0){
            return EspaciosD;
        }
        else{
            throw new CustomError('No hay espacios disponibles', 200);
        }
    }
    catch (e){
        throw e;
    }

}

export const CrearClaseS = async (Monitoria) => {
    try {
        const ClaseMonitoria = {
            ID_Horario: uuidv4(),
            Lunes: Monitoria.Lunes,
            Martes: Monitoria.Martes,
            Miércoles: Monitoria.Miércoles,
            Jueves: Monitoria.Jueves,
            Viernes: Monitoria.Viernes,
            Sábado: Monitoria.Sábado,
            ID_Espacio: Monitoria.ID_Espacio,
            ID_User: Monitoria.ID_User.toUpperCase(),
            Fecha_Inicio: Monitoria.Fecha_Inicio,
            Fecha_Fin: Monitoria.Fecha_Fin

        }
        console.log(ClaseMonitoria);

        const createClase = await crearClase(ClaseMonitoria);

        if(createClase.affectedRows > 0){
            return createClase;
        }
        else{
            throw new CustomError('Error al crear la clase de monitoria', 200);
        }
    }
    catch (e){
        throw e;
    }
}

