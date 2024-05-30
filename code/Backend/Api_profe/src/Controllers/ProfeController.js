import {CambiarEstadoReservaS, ObtenerHistorialS, ObtenerReservasProfe} from "../Services/ProfeServices.js";
import {hasRequiredDelegatedPermissions} from "../Auth/PermissionUtils.js";
import AuthConfig from "../Config/authConfig.js";
import {obtenerIdUsuarioPorCorreo} from "../Models/ModelProfe.js";



export const ObtenerReservas = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const correo = req.authInfo.preferred_username.toLowerCase();
            const ID_User = await obtenerIdUsuarioPorCorreo(correo);
            const reservas = await ObtenerReservasProfe(ID_User);
            if(reservas){
                return res.status(200).json(reservas);
            }
            else {
                return res.status(200).json({message: 'No se encontraron reservas pendientes para aprobar o rechazar'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }
    else {
        return res.status(403).json({error: 'No cuenta con los permisos requeridos para la obtención de datos'});
    }
}

export const ObtenerHistorial = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const correo = req.authInfo.preferred_username.toLowerCase();
            const ID_User = await obtenerIdUsuarioPorCorreo(correo);
            const reservas = await ObtenerHistorialS(ID_User);
            if(reservas){
                return res.status(200).json(reservas);
            }
            else {
                return res.status(200).json({error: 'No cuenta con un historial de reservas asociadas'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }
    else {
        return res.status(403).json({error: 'No cuenta con los permisos requeridos para la obtención de datos'});
    }
}

export const CambiarEstadoReserva = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        if (req.authInfo.roles.includes('Profesor')) {
            try {
                const ID_Reserva = req.params.id;
                const estado = req.body.Estado;
                if (!ID_Reserva) {
                    return res.status(400).json({ error: 'El ID de la reserva es requerido' });
                }
                if (!estado) {
                    return res.status(400).json({ error: 'El estado de la reserva es requerido' });
                }
                if (estado !== 'Aprobada' && estado !== 'Rechazada') {
                    return res.status(400).json({ error: 'El estado de la reserva debe ser Aprobada o Rechazada' });
                }

                await CambiarEstadoReservaS(ID_Reserva, estado);
                return res.status(200).json({ message: 'Estado de la reserva actualizado con éxito' });
            } catch (e) {
                return res.status(400).json({ message: e.message });
            }
        } else {
            return res.status(403).json({ error: 'No cuenta con los permisos requeridos para la actualización del estado de la reserva' });
        }
    }
}
