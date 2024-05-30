import express from "express";
import {
    CambiarEstado,
    InhabilitarEspacio,
    ObtenerAuxiliares,
    ObtenerTodosEspacios,
    CreateAux,
    ObtenerEspacios,
    ObtenerReservas,
    AsignarAux,
    GetAllAux,
    CrearClase,
    DeleteAsignacion,
    DeleteAux,
    postEspaciosDisponibles, ObtenerBloques, DeleteAsignaciones, ObtenerReservasApr
} from "../Controllers/AudController.js";
import {
    generarReporteDashFil,
    generarReporteNumHorasAux,
    generarReporteNumRes,
    generarReporteUsoEspacioClases,
    generarReporteUsoEspacioReservas
} from "../Controllers/ReportController.js";

const router = express.Router()

//Auxiliar
router.get('/getall_aux', GetAllAux)
router.get('/auxiliares', ObtenerAuxiliares)
router.post('/create_aux', CreateAux)
router.post('/asignar_aux', AsignarAux)
router.delete('/delete_asignacion/:id', DeleteAsignacion)
router.delete('/delete_asignaciones/:id', DeleteAsignaciones)
router.delete('/delete_aux/:id', DeleteAux)


//Espacios
router.get('/get_espacios', ObtenerTodosEspacios)
router.get('/espacios', ObtenerEspacios)
router.patch('/cambiar_est_esp/:id', InhabilitarEspacio)
router.get('/get_bloques/:id', ObtenerBloques)

//Reservas
router.get('/get_reservas', ObtenerReservas)
router.get('/reservas_apro', ObtenerReservasApr)
router.patch('/cambiar_estado/:id', CambiarEstado)

//Crear clase
router.post('/valide', postEspaciosDisponibles)
router.post('/create_clase', CrearClase)

//Reporte
router.get('/reporte/uso_espacio_clase', generarReporteUsoEspacioClases)
router.post('/reporte/uso_espacio_reserva', generarReporteUsoEspacioReservas)
router.post('/reporte/num_reserva', generarReporteNumRes)
router.get('/reporte/horas_trabajadas', generarReporteNumHorasAux)
router.post('/reporte/dash', generarReporteDashFil)


export default router;