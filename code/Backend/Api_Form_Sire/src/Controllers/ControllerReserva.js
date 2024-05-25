import {hasRequiredDelegatedPermissions} from "../Auth/PermissionUtils.js";
import AuthConfig from "../Config/authConfig.js";
import {obtenerEspaciosDisponibles} from "../Services/Services_Carga_Din_Form.js";
import {realizarReserva, realiziarCancelacionReserva} from "../Services/ServicesReserva.js";
import {Validate_Fh_Form_Reserva} from "../validate/Validate_Fh_Form_Reserva.js";
import {ObtenerIdUsuarioPorCorreo, obtenerReservasPorUsuario} from "../Models/ModelReserva.js";

export const postReserva = async (req, res, next) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
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
            } = req.body

            if(!Tipo_Res){
                return res.status(400).json({error: 'Faltan datos en la solicitud'});
            }

            if(Tipo_Res === '1'){
                if (!Codigo || !Nombre || !Correo || !Materia || !Nombre_Prof || !Bloque || !Salon || !Campus || !Capacidad || !Fecha || !Hora_ini || !Hora_fin || !Motivo) {
                    return res.status(400).json({error: 'Faltan datos en la solicitud'});
                }
            }
            else if(Tipo_Res === '0'){
                if (!Codigo || !Nombre || !Correo || !Bloque || !Salon || !Campus || !Capacidad || !Fecha || !Hora_ini || !Hora_fin || !Motivo) {
                    return res.status(400).json({error: 'Faltan datos en la solicitud'});
                }
            }
            else {
                return res.status(400).json({error: 'Tipo de reserva inválido'});
            }

            if(Codigo.includes('T000' || 't000')){
                const requiredLength = 9;
                if (Codigo.length !== requiredLength) {
                    return res.status(400).json({error: 'El código de usuario no es válido. Debe tener 9 caracteres. Incluyendo el T000'});
                }
            }
            else{
                return res.status(400).json({error: 'El código de usuario no es válido. Debe incluir T000'});
            }


            //Validar fechas del espacio a reservar
            const error = Validate_Fh_Form_Reserva(Hora_ini, Hora_fin, Fecha);
            if (error) {
                return res.status(400).json(error);
            }
            // Obtén los espacios disponibles
            const espaciosDisponibles = await obtenerEspaciosDisponibles(Campus, Bloque, Hora_ini, Hora_fin, Fecha);

            const espacioSeleccionado = espaciosDisponibles.find(espacio => espacio.Salon === Salon);

            if (!espacioSeleccionado) {
                return res.status(400).json({error: 'El espacio dejó de estar disponible para reservar.'});
            }

            console.log(espacioSeleccionado.Capacidad)
            if (espacioSeleccionado.Capacidad < Capacidad) {
                return res.status(400).json({error: 'La capacidad solicitada excede la capacidad del espacio.'});
            }
            else {
                const reserva = await realizarReserva(req.body);
                return res.status(200).json({message: "Reserva creada exitosamente", reserva});
            }

        } catch (e) {
            return res.status(400).json({error: e.message});
        }
    }
    else {
        return next(new Error('No cuenta con los permisos requeridos para la creación de una nueva reserva'));
    }
}

export const cancelReserva = async (req, res, next) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {

        try {
            const ID_Reserva = req.params.id;
            await realiziarCancelacionReserva(ID_Reserva);
            return res.status(200).json({message: 'Reserva cancelada con éxito'});
        } catch (error) {
            return res.status(400).json({error: error.message});
        }
    }
    else {
        return next(new Error('No cuenta con los permisos requeridos para la eliminación de una reserva'));
    }
}

export const getReservasPorUsuario = async (req, res, next) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const correo = req.authInfo.preferred_username.toLowerCase();
            console.log(correo);
            const ID_User = await ObtenerIdUsuarioPorCorreo(correo);
            console.log(ID_User);
            const reservas = await obtenerReservasPorUsuario(ID_User);
            console.log(reservas);
            if(reservas){
                return res.status(200).json(reservas);
            }
            else {
                return res.status(400).json({error: 'No se encontraron reservas para el usuario.'});
            }
        } catch (error) {
            return next(error);
        }
    }
    else {
        return next(new Error('No cuenta con los permisos requeridos para la obtención de datos.'));
    }
}

