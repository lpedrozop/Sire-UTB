import moment from "moment-timezone";


export const Validate_Fh_Form_Reserva = (horaInicio, horaFin, fecha) => {
    if (horaInicio >= horaFin) {
        return { error: 'La hora de inicio debe ser menor a la hora de fin' };
    }
    const horaInicioNum = parseInt(horaInicio.split(':')[0]);
    const horaFinNum = parseInt(horaFin.split(':')[0]);

    if(horaInicioNum < 7 || horaInicioNum > 18 || horaFinNum < 7 || horaFinNum > 18) {
        return { error: 'La hora de inicio y fin deben estar en un rango de 7am a 6pm' };
    }

    const fechaReserva = moment.tz(`${fecha}T${horaInicio}`, 'America/Bogota');
    const fechaActual = moment.tz('America/Bogota');
    if (fechaReserva.isBefore(fechaActual)) {
        return { error: 'La fecha de la reserva no puede ser anterior a la fecha actual' };
    }

    const horaActual = fechaActual.hours();
    const minutosActual = fechaActual.minutes();

    if (fechaReserva.isSame(fechaActual, 'day') && horaInicioNum < horaActual) {
        return { error: 'La hora de inicio no puede ser anterior a la hora actual' };
    }

    if (fechaReserva.isSame(fechaActual, 'day') && horaFinNum < horaActual) {
        return { error: 'La hora de fin no puede ser anterior a la hora actual' };
    }

    if (fechaReserva.isSame(fechaActual, 'day') && horaInicioNum === horaActual && parseInt(horaFin.split(':')[1]) === minutosActual) {
        return { error: 'La hora de fin no puede ser igual a la hora actual' };
    }

    // Si no hay errores, retornar null
    return null;
}
