import {hasRequiredDelegatedPermissions} from "../Auth/PermissionUtils.js";
import AuthConfig from "../Config/authConfig.js";
import {
    asignaraux,
    CambiarEstadoReserva,
    CrearAux, CrearClaseS, deleteAsignacion, deleteAsignaciones, DeleteUsuarioAux, getallAux,
    getAuxAsignados,
    getAuxNoAsignados, getBloques,
    getEspacios,
    getEspaciosDisponibles,
    getEspaciosNoDisponibles, getReservasAca, getReservasNAca, InhabilitarEsp, obtenerEspaciosDisponibles
} from "../Services/AudServices.js";
import {validateTimeFormat} from "../Helpers/ValidateHour.js";
import CustomError from "../Helpers/ErrorHelpers.js";


export const ObtenerAuxiliares = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const auxasignados = await getAuxAsignados();
            const auxnoasignados = await getAuxNoAsignados();
            if (auxasignados.length > 0 && auxnoasignados.length > 0) {
                return res.status(200).json({"Aux_Asignados": auxasignados, "Aux_NoAsignados": auxnoasignados});
            } else if (auxasignados.length > 0 && auxnoasignados.length === 0) {
                return res.status(200).json({
                    "Aux_Asignados": auxasignados,
                    "Aux_NoAsignados": "No hay auxiliares asignados en estos momentos."
                });
            } else if (auxasignados.length === 0 && auxnoasignados.length > 0) {
                return res.status(200).json({
                    "Aux_Asignados": "Todos los auxiliares han sido asignados",
                    "Aux_NoAsignados": auxnoasignados
                });
            } else {
                return res.status(200).json({message: "No hay auxiliares registrados"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso" });
    }
}

export const ObtenerTodosEspacios = async (req, res) =>{
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const espacios = await getEspacios();
            if (espacios.length > 0) {
                return res.status(200).json({"Espacios_Total": espacios});
            } else {
                return res.status(200).json({message: "No hay espacios para visualizar"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso" });
    }
}

export const ObtenerBloques = async (req, res) =>{
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const Campus = req.params.id
            console.log(Campus)
            const bloque = await getBloques(Campus);
            if (bloque.length > 0) {
                return res.status(200).json({"Bloques": bloque});
            } else {
                return res.status(200).json({message: "No hay bloques disponibles"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso" });
    }
}



export const ObtenerEspacios = async (req, res) =>{
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const espaciosNoDisponibles = await getEspaciosNoDisponibles();
            const espaciosDisponibles = await getEspaciosDisponibles();

            if (espaciosDisponibles.length > 0 && espaciosNoDisponibles.length > 0) {
                return res.status(200).json({
                    "Espacios_Disponibles": espaciosDisponibles,
                    "Espacios_NoDisponibles": espaciosNoDisponibles
                });
            } else if (espaciosDisponibles.length > 0 && espaciosNoDisponibles.length === 0) {
                return res.status(200).json({
                    "Espacios_Disponibles": espaciosDisponibles,
                    "Espacios_NoDisponibles": "Todos los espacios están disponibles para ser reservados"
                });
            } else if (espaciosDisponibles.length === 0 && espaciosNoDisponibles.length > 0) {
                return res.status(200).json({
                    "Espacios_Disponibles": "No hay espacios disponibles para ser reservados",
                    "Espacios_NoDisponibles": espaciosNoDisponibles
                });
            } else {
                return res.status(200).json({message: "No hay espacios para visualizar"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const CreateAux = async (req, res) => {
    if(hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {ID_User, Nombre} = req.body;
            if (!ID_User || !Nombre) {
                return res.status(400).json({error: "Debe proporcionar el ID del usuario y el nombre del usuario"});
            }
            console.log(ID_User)
            if (ID_User.includes('T000') || ID_User.includes('t000')) {
                const requiredLength = 9;
                if (ID_User.length !== requiredLength) {
                    return res.status(400).json({error: "El código de usuario no es válido. Debe tener 9 caracteres. Incluyendo el T000"});
                }
            } else {
                return res.status(400).json({error: "El código de usuario no es válido. Debe incluir T000"});
            }

            const crearaux = await CrearAux(ID_User, Nombre);
            console.log(crearaux);
            if ((crearaux && crearaux.affectedRows > 0)) {
                return res.status(200).json({message: "Usuario auxiliar creado correctamente"});
            } else {
                return res.status(500).json({error: "Error al crear un nuevo usuario auxiliar"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const InhabilitarEspacio = async (req, res) => {
    if(hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {id} = req.params;
            let {Disponibilidad} = req.body;
            Disponibilidad = Disponibilidad.toString();
            console.log(Disponibilidad)
            if (!id || !Disponibilidad) {
                return res.status(400).json({error: "Debe proporcionar todos los campos"});
            }

            if (Disponibilidad > 1) {
                return res.status(400).json({error: "El valor de disponibilidad no es válido"});
            }

            const inhabilitarEspacio = await InhabilitarEsp(id, Disponibilidad);
            if (inhabilitarEspacio.affectedRows > 0) {
                return res.status(200).json({message: "Estado del espacio cambiado correctamente"});
            } else {
                return res.status(500).json({message: "Error al inhabilitar el espacio"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const CambiarEstado = async (req, res) => {
    if(hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {id} = req.params;
            const {Estado} = req.body;

            if (!id || !Estado) {
                return res.status(400).json({error: "Debe proporcionar todos los campos"});
            }

            console.log(Estado)
            if (Estado !== "Aprobada" && Estado !== "Rechazada") {
                return res.status(400).json({error: 'El estado no es válido'});
            } else {
                const cambiarEstadoReser = await CambiarEstadoReserva(id, Estado);
                if (cambiarEstadoReser.affectedRows > 0) {
                    return res.status(200).json({message: "Estado de la reserva modificado correctamente"});
                } else {
                    return res.status(500).json({error: "Error al cambiar el estado de la reserva"});
                }
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const ObtenerReservas = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const reservasaca = await getReservasAca();
            const reservasNaca = await getReservasNAca();
            if (reservasaca.length > 0 && reservasNaca.length > 0) {
                console.log("Reservas_Aca", reservasaca, "Reservas_NAca", reservasNaca);
                return res.status(200).json({"Reservas_Aca": reservasaca, "Reservas_NAca": reservasNaca});
            } else if (reservasaca.length > 0 && reservasNaca.length === 0) {
                console.log("Reservas_Aca", reservasaca, "Reservas_NAca", reservasNaca);
                return res.status(200).json({
                    "Reservas_Aca": reservasaca,
                    "Reservas_NAca": "No hay reservas catalogadas como no académicas."
                });
            } else if (reservasaca.length === 0 && reservasNaca.length > 0) {
                console.log("Reservas_Aca", reservasaca, "Reservas_NAca", reservasNaca);
                return res.status(200).json({
                    "Reservas_Aca": "No hay reservas catalogadas como académicas.",
                    "Reservas_NAca": reservasNaca
                });
            } else {
                console.log("Reservas_Aca", reservasaca, "Reservas_NAca", reservasNaca);
                return res.status(200).json({message:"No hay reservas para visualizar"});
            }
        }
        catch (e) {
            console.error('Error:', e);
                if (e instanceof CustomError) {
                    return res.status(e.code).json({ error: e.message });
                } else {
                    return res.status(500).json({ error: "Internal Server Error" });
                }
            }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const AsignarAux = async (req, res) =>{
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {ID_User, Bloque_L_V, Bloque_S, Lunes, Martes, Miércoles, Jueves, Viernes, Sábado} = req.body;

            if (!ID_User) {
                return res.status(400).json({error: "El ID del usuario es requerido"});
            }
            if (!Bloque_L_V && !Bloque_S) {
                return res.status(400).json({error: "Debe seleccionar al menos un bloque"});
            }
            if (ID_User.includes('T000') || ID_User.includes('t000')) {
                const requiredLength = 9;
                if (ID_User.length !== requiredLength) {
                    return res.status(400).json({error: "El código de usuario no es válido. Debe tener 9 caracteres. Incluyendo el T000"});
                }
            } else {
                return res.status(400).json({error: "El código de usuario no es válido. Debe incluir T000"});
            }

            if (Bloque_L_V) {
                if (!Lunes && !Martes && !Miércoles && !Jueves && !Viernes) {
                    return res.status(400).json({error: "Debe proporcionar la hora de asignación de al menos un día de la semana de lunes a viernes"});
                }
            }
            if (Bloque_S) {
                if (!Sábado) {
                    return res.status(400).json({error: "Debe proporcionar la hora de asignación del día sábado"});
                }
            }

            const asiAux = await asignaraux(req.body)
            console.log(asiAux)
            if (asiAux.affectedRows > 0) {
                return res.status(200).json({message: "Asignación de bloque al auxiliar realizada correctamente"});
            } else {
                return res.status(500).json({error: "Error al asignar el bloque al auxiliar"})
            }
        }
        catch (e) {
            console.error('Error:', e);
                if (e instanceof CustomError) {
                    return res.status(e.code).json({ error: e.message });
                } else {
                    return res.status(500).json({ error: "Internal Server Error" });
                }
            }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const GetAllAux = async (req, res) => {
if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const auxiliares = await getallAux();
            console.log(auxiliares)
            if (auxiliares.length > 0) {
                return res.status(200).json({"Auxiliares": auxiliares})
            } else {
                return res.status(200).json({message: "No hay usuarios auxiliares registrados"})
            }
        }
        catch (e) {
            console.error('Error:', e);
                if (e instanceof CustomError) {
                    return res.status(e.code).json({ error: e.message });
                } else {
                    return res.status(500).json({ error: "Internal Server Error" });
                }
            }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const DeleteAsignacion = async (req, res) => {
    if(hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {id} = req.params;
            console.log(id);
            if(!id){
                return res.status(400).json({error: "El ID de la reserva es requerido"});
            }
            const deleteAsignaciones = await deleteAsignacion(id);
            if(deleteAsignaciones.affectedRows > 0){
                return res.status(200).json({message: "Asignación eliminada correctamente para el usuario", id});
            }
            else {
                return res.status(500).json({error: "Error al eliminar la asignación"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const DeleteAsignaciones = async (req, res) => {
    if(hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {id} = req.params;
            console.log(id);
            if(!id){
                return res.status(400).json({error: "El ID del usuario es requerido"});
            }
            if(id.includes('T000') || id.includes('t000')){
                const requiredLength = 9;
                if (id.length !== requiredLength) {
                    return res.status(400).json({error: "El código de usuario no es válido. Debe tener 9 caracteres. Incluyendo el T000"});
                }
            }
            else{
                return res.status(400).json({error: "El código de usuario no es válido. Debe incluir T000"});
            }

            const deleteasignaciones = await deleteAsignaciones(id);
            if(deleteasignaciones.affectedRows > 0){
                return res.status(200).json({message: "Asignaciones eliminadas correctamente para el usuario", id});
            }
            else {
                return res.status(500).json({error: "Error al eliminar las asignaciones"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}


export const DeleteAux = async (req, res) => {
    if(hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {id} = req.params;
            if(!id){
                return res.status(400).json({error: "El ID del usuario es requerido"});
            }
            if(id.includes('T000') || id.includes('t000')){
                const requiredLength = 9;
                if (id.length !== requiredLength) {
                    return res.status(400).json({error: "El código de usuario no es válido. Debe tener 9 caracteres. Incluyendo el T000"});
                }
            }
            else{
                return res.status(400).json({error: "El código de usuario no es válido. Debe incluir T000"});
            }

            const deleteAux = await DeleteUsuarioAux(id);
            if(deleteAux.affectedRows > 0){
                return res.status(200).json({message: "Usuario auxiliar eliminado correctamente"});
            }
            else {
                return res.status(500).json({error: "Error al eliminar el usuario auxiliar"});
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}


export const postEspaciosDisponibles = async (req,res) => {
    if(hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const horarios = {
                Lunes: req.body.Lunes,
                Martes: req.body.Martes,
                Miércoles: req.body.Miércoles,
                Jueves: req.body.Jueves,
                Viernes: req.body.Viernes,
                Sábado: req.body.Sábado
            };
            const Campus = req.body.Campus;
            const Aforo = req.body.Aforo;

            if(!Campus || !Aforo){
                return res.status(400).json({message: "Debe proporcionar todos los campos del aula Bloque y Campus"})
            }

            if(!horarios.Lunes && !horarios.Martes && !horarios.Miércoles && !horarios.Jueves && !horarios.Viernes && !horarios.Sábado){
                return res.status(400).json({message: "Debe seleccionar al menos un día de la semana"})
            }

            else{
                for (const day in horarios) {
                    if (horarios[day] && !validateTimeFormat(horarios[day])) {
                        return res.status(400).json({error: `El formato de la hora para ${day} no es válido. Debe ser HH:MM-HH:MM`});
                    }
                }
                const AulasD = await obtenerEspaciosDisponibles(horarios, Campus, Aforo);
                if(AulasD.length > 0){
                    return res.status(200).json({aulas: {Disponibles: AulasD}})
                }
                else{
                    return res.status(200).json({message: "No hay aulas disponible bajo los parámetros seleccionados"})
                }
            }
        }
        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso"});
    }
}

export const CrearClase = async (req, res) => {
    if(hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {
                Lunes,
                Martes,
                Miércoles,
                Jueves,
                Viernes,
                Sábado,
                ID_User,
                ID_Espacio,
                Fecha_Inicio,
                Fecha_Fin

            } = req.body

            if(!ID_Espacio){
                return res.status(400).json({error: "Debe proporcionar el ID_Espacio"})
            }
            if(!ID_User){
                return res.status(400).json({error: "Debe proporcionar el ID del usuario monitor"})
            }
            if(!Fecha_Inicio || !Fecha_Fin){
                return res.status(400).json({error: "Debe proporcionar la fecha inicial y final en la que se hará la asignación del aula"})
            }

            if(ID_User.includes('T000') || ID_User.includes('t000')){
                const requiredLength = 9;
                if (ID_User.length !== requiredLength) {
                    return res.status(400).json({error: "El código de usuario no es válido. Debe tener 9 caracteres. Incluyendo el T000"});
                }
            }
            else{
                return res.status(400).json({error: "El código de usuario no es válido. Debe incluir T000"});
            }

            if(!Lunes && !Martes && !Miércoles && !Jueves && !Viernes && !Sábado){
                return res.status(400).json({message: "Debe seleccionar al menos un día de la semana"})
            }
            else{
                const crearClase = await CrearClaseS(req.body);
                if(crearClase.affectedRows > 0){
                    return res.status(200).json({message: "Asignación de aula para monitoria creada con éxito"})
                }
                else{
                    return res.status(500).json({error: "Error al crear la clase"})
                }
            }
        }

        catch (e) {
            console.error('Error:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ error: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: "No tiene permisos suficientes para acceder a este recurso" });
    }
}

