import {hasRequiredDelegatedPermissions} from "../Auth/PermissionUtils.js";
import AuthConfig from "../Config/authConfig.js";
import {
    getBlocksAndHoursForToday,
    getClassesWithUserForToday,
    getReservedSpacesForToday, InsertarReporte
} from "../Services/AuxServices.js";
import {obtenerIdUsuarioPorCorreo} from "../Models/ModelAux.js";

export const ObtenerEspaciosAux = async (req, res) => {
   if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
       try {
           const correo = req.authInfo.preferred_username.toLowerCase();
           const ID_User = await obtenerIdUsuarioPorCorreo(correo);
           let blocksAndHours;
           try {
               blocksAndHours = await getBlocksAndHoursForToday(ID_User);
           } catch (e) {
               console.error(e.message);
               if(e.message === 'Eso es todo por hoy!'){
                   return res.status(200).json({message: e.message,
                       "Reservas": [], "Clases_regulares": []});
               }
               throw e;
           }

           let reservas = [];
           let clases = [];

           for (let blockAndHour of blocksAndHours) {
               let {Bloque, startTime, endTime} = blockAndHour;
               let clasesForBlock = await getClassesWithUserForToday(Bloque, startTime, endTime);
               let reservasForBlock = await getReservedSpacesForToday(Bloque, startTime, endTime);
               clases = [...clases, ...clasesForBlock];
               reservas = [...reservas, ...reservasForBlock];
           }
           if (clases.length >= 0 && reservas.length >= 0) {
               return res.status(200).json({"Reservas": reservas, "Clases_regulares": clases});
           }
       }
    catch (e) {
           console.log("Error ocurrido para la obtención de espacios asignados", e)
           console.error(e.message)

           return res.status(500).json({message: e.message});
       }
   }
   else {
        return res.status(403).json({error: 'No cuenta con los permisos requeridos para la obtención de datos'});
   }
}


export const CrearReporte = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const correo = req.authInfo.preferred_username.toLowerCase();
            const ID_User = await obtenerIdUsuarioPorCorreo(correo);
            const {ID_Reserva, ID_Horario, Pre_Reporte, Descripcion} = req.body;

            if ((ID_Reserva && ID_Horario) || (!ID_Reserva && !ID_Horario)) {
                return res.status(400).json({ error: 'Debe proporcionar ID_Reserva o ID_Horario, pero no ambos a la vez' });
            }

            if (Pre_Reporte === 1 && !Descripcion) {
                return res.status(400).json({ error: 'La descripción es obligatoria cuando Pre_Reporte es 1' });
            }
            const insertreporte = {
                ID_User: ID_User,
                ID_Reserva,
                ID_Horario,
                Pre_Reporte,
                Descripcion
            }
            const reporte = await InsertarReporte(insertreporte);

            if(reporte){
                return res.status(200).json({Estado: "Reporte creado correctamente"})
            }
            else{
                return res.status(400).json({error: 'No se pudo crear el reporte'});
            }

        }
    catch (e) {
        return res.status(500).json({message: e.message});
    }
 }
    else {
        return res.status(403).json({error: 'No cuenta con los permisos requeridos para la obtención de datos'});
    }
}
