import express from "express";
import {CrearReporte, ObtenerEspaciosAux} from "../Controllers/AuxController.js";

const router = express.Router();

router.get('/espaciosaux', ObtenerEspaciosAux)//Devuelve todos los espacios donde hay una reserva o una clase que estén asignados al auxiliar
router.post('/reporte', CrearReporte)//Crea un reporte de una reserva o una clase regular

export default router;