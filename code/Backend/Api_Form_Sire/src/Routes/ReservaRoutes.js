import express from "express";
import {
    getBloques,
    GetMaterias,
    getProfesores,
    postEspaciosDisponibles
} from "../Controllers/Controller_Carga_Din_Form.js";
import {cancelReserva, getReservasPorUsuario, postReserva} from "../Controllers/ControllerReserva.js";

const router = express.Router();

router.get('/materia', GetMaterias)//Devuelve todas las materias que se dan en la universidad
router.get('/profesor/:id', getProfesores)//En base a la materia devuelve los nombres de los profesores que la imparten
router.get('/bloque/:id', getBloques)//En base al campues devuelve los espacios de ese campus
router.post('/validate', postEspaciosDisponibles)//En base a los datos de la reserva, devuelve los espacios disponibles y los parcialmente disponibles (reserva pendiente)
router.post('/create_reser', postReserva)//Crea una nueva reserva
router.patch('/cancel_reser/:id', cancelReserva)//Cancela una reserva cambia el estado de la reserva a cancelada
router.get('/getAll',getReservasPorUsuario ) //Devuelve todas las reservas de un usuario
export default router;

