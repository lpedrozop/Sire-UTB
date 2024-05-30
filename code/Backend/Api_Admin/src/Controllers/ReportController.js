import {
    generarinformeDashFiltrado,
    generarInformeNumHorasAux,
    generarInformeNumReser,
    generarInformeUsoEspacioClases,
    generarInformeUsoEspacioReserva
} from "../Services/ReportServices.js";
import {hasRequiredDelegatedPermissions} from "../Auth/PermissionUtils.js";
import AuthConfig from "../Config/authConfig.js";
import {isValidDate} from "../Helpers/dateValidator.js";
import CustomError from "../Helpers/ErrorHelpers.js";


export const generarReporteUsoEspacioClases = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const result = await generarInformeUsoEspacioClases();
            res.status(200);
            return res.download(result.filePath);
        } catch (e) {
            console.error('Error al generar el informe de uso de espacio:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ message: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
     else {
        return res.status(403).json({ error: 'No tiene permisos suficientes para acceder a este recurso' });
    }
};


export const generarReporteUsoEspacioReservas = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
    try {

        const { Fecha_Inicio, Fecha_Fin } = req.body;
        console.log(req.body)

        if(!Fecha_Inicio || !Fecha_Fin){
            return res.status(400).json({ error: 'Debe proporcionar las fechas de inicio y fin para generar el informe' });
        }

        if(!isValidDate(Fecha_Inicio) || !isValidDate(Fecha_Fin)){
            return res.status(400).json({ error: 'Las fechas proporcionadas no son válidas' });
        }

        const result = await generarInformeUsoEspacioReserva(Fecha_Inicio, Fecha_Fin);
        res.status(200);
        return res.download(result.filePath);
    } catch (e) {
        console.error('Error al generar el informe de uso de espacio:', e);
        if (e instanceof CustomError) {
            return res.status(e.code).json({ message: e.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    } else {
        return res.status(403).json({ error: 'No tiene permisos suficientes para acceder a este recurso' });
    }
}

export const generarReporteNumRes = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {

            const {Fecha_Inicio, Fecha_Fin} = req.body;

            if (!Fecha_Inicio || !Fecha_Fin) {
                return res.status(400).json({error: 'Debe proporcionar las fechas de inicio y fin para generar el informe'});
            }

            if (!isValidDate(Fecha_Inicio) || !isValidDate(Fecha_Fin)) {
                return res.status(400).json({error: 'Las fechas proporcionadas no son válidas'});
            }

            const result = await generarInformeNumReser(Fecha_Inicio, Fecha_Fin);
            res.status(200);
            return res.download(result.filePath);
        } catch (e) {
            console.error('Error al generar el informe de uso de espacio:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ message: e.message });
            } else {
                return res.status(500).json({error: "Internal Server Error"});
            }
        }
    }
    else {
        return res.status(403).json({ error: 'No tiene permisos suficientes para acceder a este recurso' });
    }
}

export const generarReporteNumHorasAux = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {
            const result = await generarInformeNumHorasAux();
            res.status(200);
            return res.download(result.filePath);
        } catch (e) {
            console.error('Error al generar el informe de uso de espacio:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ message: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: 'No tiene permisos suficientes para acceder a este recurso' });
    }
};

export const generarReporteDashFil = async (req, res) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, AuthConfig.protectedRoutes.reserva.delegatedPermissions.access)) {
        try {

            const {Fecha_Inicio, Fecha_Fin, Estados} = req.body;

            if (!Fecha_Inicio || !Fecha_Fin || !Estados) {
                return res.status(400).json({error: 'Debe proporcionar las fechas de inicio y fin y los estados para generar el informe'});
            }

            if (!Array.isArray(Estados)) {
                return res.status(400).json({error: 'Los estados deben ser proporcionados como un array'});
            }

            const validStates = ['Aprobada', 'Rechazada', 'Pendiente'];
            if (!Estados.every(estado => validStates.includes(estado))) {
                return res.status(400).json({error: 'Uno o más estados proporcionados no son válidos'});
            }

            if (!isValidDate(Fecha_Inicio) || !isValidDate(Fecha_Fin)) {
                return res.status(400).json({error: 'Las fechas proporcionadas no son válidas'});
            }

            const result = await generarinformeDashFiltrado(Fecha_Inicio, Fecha_Fin, Estados);
            res.status(200);
            return res.download(result.filePath);
        } catch (e) {
            console.error('Error al generar el informe de uso de espacio:', e);
            if (e instanceof CustomError) {
                return res.status(e.code).json({ message: e.message });
            } else {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    else {
        return res.status(403).json({ error: 'No tiene permisos suficientes para acceder a este recurso' });
    }
}

