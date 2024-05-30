import {
    CambiarEstadoFinalizada,
    getAssignedBlocksAndHours,
    getAssignedClassesWithUserName,
    getReservedSpaces,
    InsertReport
} from '../Models/ModelAux.js';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';


export const getBlocksAndHoursForToday = async (ID_User) => {
    try {
        // Obtener la fecha actual en UTC-5 (America/Bogota)
        const now = new Date();
        const options = { weekday: 'long', timeZone: 'America/Bogota' };
        const dayOfWeek = now.toLocaleString('es-ES', options);

        const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

        const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        if (!validDays.includes(capitalizedDayOfWeek)) {
            throw new Error('Eso es todo por hoy!');
        }
        const blockColumn = capitalizedDayOfWeek === 'Sábado' ? 'Bloque_S' : 'Bloque_L_V';

        const assignedBlocksAndHours = await getAssignedBlocksAndHours(ID_User, capitalizedDayOfWeek, blockColumn);

        console.log(assignedBlocksAndHours);

        if (assignedBlocksAndHours.length === 0 || (assignedBlocksAndHours[0].Bloque === null && assignedBlocksAndHours[0].Horas === null)) {
            console.log('Eso es todo por hoy! No cuenta con espacios asignados actualmente');
            throw new Error('Eso es todo por hoy!');
        }

        // Crear un nuevo array de objetos, donde cada objeto contiene el Bloque, startTime y endTime para cada bloque asignado
        const blocksAndHoursForToday = assignedBlocksAndHours.map(({Bloque, Horas}) => {
            const [startTime, endTime] = Horas.split('-');
            console.log('Bloque asignado:', Bloque);
            console.log('Hora de inicio:', startTime);
            console.log('Hora de fin:', endTime);
            return {Bloque, startTime, endTime};
        });

        console.log(capitalizedDayOfWeek)
        return blocksAndHoursForToday;
    } catch (e) {
        throw e;
    }
};


export const getClassesWithUserForToday = async (Bloque, startTime, endTime) => {
    try {

        const dayOfWeek = new Date().toLocaleString('es-ES', {weekday: 'long'});
        const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
        const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        if (!validDays.includes(capitalizedDayOfWeek)) {
            throw new Error(`Eso es todo por hoy!`);
        }
        const assignedClassesWithUserName = await getAssignedClassesWithUserName(capitalizedDayOfWeek, startTime, endTime, Bloque);
        return assignedClassesWithUserName;
    }
    catch (e) {
        throw e;
    }
};

export const getReservedSpacesForToday = async (Bloque, startTime, endTime) => {
    try {
        const date = moment().tz("America/Bogota").format("YYYY-MM-DD");const startDateTime = `${date} ${startTime}:00`;
        const endDateTime = `${date} ${endTime}:00`;
        const reservedSpaces = await getReservedSpaces(Bloque, startDateTime, endDateTime);
        return reservedSpaces;
    }
    catch (e) {
        throw new Error('Error al obtener los espacios reservados para hoy' + e.message);
    }
};

export const InsertarReporte = async (reporte) => {
    try {
        const { ID_User, ID_Reserva, ID_Horario, Pre_Reporte, Descripcion  } = reporte;
        const reporteParaInsertar = {
        ID_Reporte: uuidv4(),
        ID_User,
        ID_Reserva,
        ID_Horario,
        Fh_Reporte: moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss"),
        Pre_Reporte,
        };
        if(Pre_Reporte === 1){
            reporteParaInsertar.Descripcion = Descripcion;
        }
        else{
            reporteParaInsertar.Descripcion = "Sin novedad alguna"
        }

        const report = await InsertReport(reporteParaInsertar);
        if(report){
            console.log('Reporte creado correctamente');
            const finish = await CambiarEstadoFinalizada(ID_Reserva);
            if(finish){
                console.log('Reserva finalizada');
            }

        }
        return report;
    } catch (e) {
        throw new Error('Error al insertar el reporte. ' + e.message);
    }
}