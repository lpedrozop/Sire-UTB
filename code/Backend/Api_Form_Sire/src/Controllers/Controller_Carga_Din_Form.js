import {
    obtenerBloquesPorCampus, obtenerEspaciosDisponibles, obtenerEspaciosReservaPendiente,
    obtenerProfesoresPorMateria,
    obtenerTodasLasMaterias
} from "../Services/Services_Carga_Din_Form.js";
import {Validate_Fh_Form_Reserva} from "../validate/Validate_Fh_Form_Reserva.js";
import {
    hasRequiredDelegatedPermissions
} from "../Auth/PermissionUtils.js";
import AuthConfig from "../Config/authConfig.js";

export const GetMaterias = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const materias = await obtenerTodasLasMaterias();
            res.status(200).json({materias});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    } else {
        return res.status(403).json({error: 'No cuenta con los permisos requeridos para la obtención de datos'});
    }
}

export const getProfesores = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const materia = decodeURIComponent(req.params.id);
            const profesores = await obtenerProfesoresPorMateria(materia);
            res.status(200).json(profesores);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    } else {
        return res.status(403).json({error: 'No cuenta con los permisos requeridos para la obtención de datos'});
    }
}

export const getBloques = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const campus = req.params.id;
            const bloques = await obtenerBloquesPorCampus(campus);
            res.status(200).json(bloques);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    } else {
        return res.status(403).json({error: 'No cuenta con los permisos requeridos para la obtención de datos'});
    }
}

export const postEspaciosDisponibles = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const {Campus, Bloque, Hora_ini, Hora_fin, Fecha} = req.body;

            if (!Campus || !Bloque || !Hora_ini || !Hora_fin || !Fecha) {
                return res.status(400).json({error: 'Faltan datos en la solicitud'});
            }

            console.log(Hora_ini, Hora_fin, Fecha)
            // Validar fechas del espacio a reservar
            const error = Validate_Fh_Form_Reserva(Hora_ini, Hora_fin, Fecha);
            if (error) {
                return res.status(400).json(error);
            }

            console.log(Hora_ini, Hora_fin, Fecha)
            const espaciosDisponibles = await obtenerEspaciosDisponibles(Campus, Bloque, Hora_ini, Hora_fin, Fecha);
            const espaciosReservaPendiente = await obtenerEspaciosReservaPendiente(Campus, Bloque, Hora_ini, Hora_fin, Fecha);
            if (espaciosDisponibles.length === 0 && espaciosReservaPendiente.length === 0) {
                return res.status(200).json({error: 'No hay espacios disponibles para la fecha y hora seleccionadas.'});
            }
            res.status(200).json({
                aulas: {
                    Disponibles: espaciosDisponibles,
                    Parcial_Disponibilidad: espaciosReservaPendiente
                }
            });
        } catch (error) {
            switch (error.code) {
                case 'ER_NO_REFERENCED_ROW_2':
                case 'ER_NO_REFERENCED_ROW':
                    return res.status(400).json({error: 'El ID del campus o bloque no existe. Por favor, verifica e intenta de nuevo.'});
                case 'ER_DUP_ENTRY':
                    return res.status(400).json({error: 'Ya existe una reserva con los mismos datos. Por favor, verifica e intenta de nuevo.'});
                case 'ER_BAD_NULL_ERROR':
                    return res.status(400).json({error: 'Algunos campos necesarios están vacíos. Por favor, verifica e intenta de nuevo.'});
                case 'ER_PARSE_ERROR':
                    return res.status(500).json({error: 'Hubo un error al procesar la solicitud. Por favor, intenta de nuevo más tarde.'});
                default:
                    // Si el error es debido a otra cosa, simplemente devuelve el error original
                    return res.status(500).json({error: error.message});
            }
        }
    }
    else {
        return res.status(403).json({error: 'No cuenta con los permisos requeridos para la obtención de datos'});
    }
}

