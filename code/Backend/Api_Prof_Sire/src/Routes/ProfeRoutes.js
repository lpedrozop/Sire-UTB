import express from "express";
import {CambiarEstadoReserva, ObtenerHistorial, ObtenerReservas} from "../Controllers/ProfeController.js";

const router = express.Router();

router.get('/reserva_profe', ObtenerReservas)//Devuelve todas las reservas asociadas al docente
router.patch('/estado_reserva/:id', CambiarEstadoReserva)//Cambia el estado de una reserva
router.get('/historial', ObtenerHistorial)//Devuelve el historial de reservas del docente

export default router;