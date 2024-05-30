import {fileURLToPath} from "url";
import {dirname} from "path";
import ExcelJS from "exceljs";
import {
    DashboardFiltro,
    HorasTrabajadasAux,
    NumeroReservas,
    obtenerDatosClases,
    obtenerDatosReservas
} from "../Models/ReportModel.js";
import {aplicarEstilosExcel} from "../Helpers/ExcelHelpers.js";
import path from "path";
import fs from "fs";
import CustomError from "../Helpers/ErrorHelpers.js";


export const generarInformeUsoEspacioClases = async () => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const workbook = new ExcelJS.Workbook();

        const datosClases = await obtenerDatosClases();
        console.log(datosClases);

        // Validar los datos antes de agregarlos a las hojas
        if (!Array.isArray(datosClases)) {
            throw new CustomError('Los datos obtenidos no son válidos', 200);
        }

        if(datosClases.length === 0){
            throw new CustomError('No se encontraron datos para generar el informe', 200);
        }

        else {

            const sheetClases = workbook.addWorksheet('Reporte de Clases');

            // Definir las columnas
            sheetClases.columns = [
                {header: 'Campus', key: 'Campus', width: 10},
                {header: 'Salon', key: 'Salon', width: 10},
                {header: 'Tipo', key: 'Tipo', width: 10},
                {header: 'Numero Clases', key: 'Numero_Clases', width: 15},
                {header: 'Horas Utilizadas', key: 'Horas_Util', width: 18}
            ];

            // Añadir los datos
            datosClases.forEach(dato => sheetClases.addRow(dato));

            // Aplicar los estilos
            aplicarEstilosExcel(sheetClases);

            // Crear el directorio temporal si no existe
            const dirPath = path.join(__dirname, '../temp');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            // Guardar el archivo Excel en una ubicación temporal
            const filePath = `${dirPath}/Informe_Uso_Espacio_Clase_${Date.now()}.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            return {filePath};
        }
    } catch (error) {
        console.error('Error al generar el informe de uso de espacio:', error);
        throw error;
    }
};

export const generarInformeUsoEspacioReserva = async (FechaInicio, FechaFin) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const workbook = new ExcelJS.Workbook();

        const datosReservas = await obtenerDatosReservas(FechaInicio, FechaFin);
        console.log(datosReservas);

        // Validar los datos antes de agregarlos a las hojas
        if (!Array.isArray(datosReservas)) {
            throw new CustomError('Los datos obtenidos no son válidos', 200);
        }

        if(datosReservas.length === 0){
            throw new CustomError('No se encontraron datos para el rango de fechas proporcionado', 200);
        }
        else {
            const sheetClases = workbook.addWorksheet('Reporte de Reservas');
            // Definir las columnas
            sheetClases.columns = [
                {header: 'Campus', key: 'Campus', width: 10},
                {header: 'Salon', key: 'Salon', width: 10},
                {header: 'Tipo', key: 'Tipo', width: 10},
                {header: 'Numero Reservas Pendientes', key: 'Numero_Reservas_Pendientes', width: 35},
                {header: 'Numero Reservas Aprobadas', key: 'Numero_Reservas_Aprobadas', width: 35},
                {header: 'Numero Reservas Rechazadas', key: 'Numero_Reservas_Rechazadas', width: 35},
                {header: 'Total Reservas', key: 'Total_Reservas', width: 25},
                {header: 'Horas Utilizadas del Espacio (Aprobadas)', key: 'Horas_Utilizadas', width: 40},

            ];

            // Añadir los datos
            datosReservas.forEach(dato => sheetClases.addRow(dato));

            // Aplicar los estilos
            aplicarEstilosExcel(sheetClases);

            // Crear el directorio temporal si no existe
            const dirPath = path.join(__dirname, '../temp');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            // Guardar el archivo Excel en una ubicación temporal
            const filePath = `${dirPath}/Informe_Uso_Espacio_Reservas_${Date.now()}.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            return {filePath};
        }
    } catch (error) {
        console.error('Error al generar el informe de uso de espacio:', error);
        throw error;
    }
};

export const generarInformeNumReser = async (FechaInicio, FechaFin) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const workbook = new ExcelJS.Workbook();

        const NumReser = await NumeroReservas(FechaInicio, FechaFin);
        console.log(NumReser);

        // Validar los datos antes de agregarlos a las hojas
        if (!Array.isArray(NumReser)) {
            throw new CustomError('Los datos obtenidos no son válidos', 200);
        }

        if(NumReser.length === 0){
            throw new CustomError('No se encontraron datos para el rango de fechas proporcionado', 200);
        }
        else {
            const sheetClases = workbook.addWorksheet('Reporte de Número de Reservas');
            // Definir las columnas
            sheetClases.columns = [
                {header: 'Rol', key: 'Rol', width: 10},
                {header: 'Nombre', key: 'Nombre', width: 30},
                {header: 'Número Reservas Pendientes', key: 'Numero_Reservas_Pendientes', width: 35},
                {header: 'Número Reservas Aprobadas', key: 'Numero_Reservas_Aprobadas', width: 35},
                {header: 'Número Reservas Rechazadas', key: 'Numero_Reservas_Rechazadas', width: 35},
                {header: 'Total Reservas', key: 'Total_Reservas', width: 25},
            ];

            // Añadir los datos
            NumReser.forEach(dato => sheetClases.addRow(dato));

            // Aplicar los estilos
            aplicarEstilosExcel(sheetClases);

            // Crear el directorio temporal si no existe
            const dirPath = path.join(__dirname, '../temp');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            // Guardar el archivo Excel en una ubicación temporal
            const filePath = `${dirPath}/Informe_Num_Reservas_User_${Date.now()}.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            return {filePath};
        }
    } catch (error) {
        console.error('Error al generar el informe de uso de espacio:', error);
        throw error;
    }
};

export const generarInformeNumHorasAux = async () => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const workbook = new ExcelJS.Workbook();

        const HorasAux = await HorasTrabajadasAux();
        console.log(HorasAux);

        // Validar los datos antes de agregarlos a las hojas
        if (!Array.isArray(HorasAux)) {
            throw new CustomError('Los datos obtenidos no son válidos', 200);
        }

        if(HorasAux.length === 0){
            throw new CustomError('No se encontraron datos para generar el reporte', 200);
        }
        else {
            const sheetClases = workbook.addWorksheet('Horas Trabajadas Auxiliares S');
            // Definir las columnas
            sheetClases.columns = [
                {header: 'Código', key: 'ID_User', width: 12},
                {header: 'Nombre', key: 'Nombre', width: 38},
                {header: 'Horas Trabajadas S', key: 'Total_Horas_Trabajo', width: 25},
            ];

            // Añadir los datos
            HorasAux.forEach(dato => sheetClases.addRow(dato));

            // Aplicar los estilos
            aplicarEstilosExcel(sheetClases);

            // Crear el directorio temporal si no existe
            const dirPath = path.join(__dirname, '../temp');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            // Guardar el archivo Excel en una ubicación temporal
            const filePath = `${dirPath}/Informe_Num_Horas_Aux_${Date.now()}.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            return {filePath};
        }
    } catch (error) {
        console.error('Error al generar el informe de uso de espacio:', error);
        throw error;
    }
};

export const generarinformeDashFiltrado = async (FechaInicio, FechaFin, Estado) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const workbook = new ExcelJS.Workbook();

        const DashFiltro = await DashboardFiltro(FechaInicio, FechaFin, Estado);
        console.log(DashFiltro);

        // Validar los datos antes de agregarlos a las hojas
        if (!Array.isArray(DashFiltro)) {
            throw new CustomError('Los datos obtenidos no son válidos', 200);
        }

        if(DashFiltro.length === 0){
            throw new CustomError('No se encontraron datos para el rango de fechas y Estados proporcionado', 200);
        }
        else {
            const sheetClases = workbook.addWorksheet('Reporte de Dashboard '+ Estado);
            // Definir las columnas
            sheetClases.columns = [
                { header: 'Código Reservante', key: 'ID_Reservante', width: 20 },
                { header: 'Nombre Reservante', key: 'Nombre_Reservante', width: 38 },
                { header: 'Aula', key: 'Aula', width: 15 },
                { header: 'Tipo Reserva', key: 'Tipo_Res', width: 15 },
                { header: 'Fecha Inicio', key: 'Fecha_Inicio', width: 15 },
                { header: 'Fecha Fin', key: 'Fecha_Fin', width: 15 },
                { header: 'Estado', key: 'Estado', width: 15 },
                { header: 'Motivo', key: 'Motivo', width: 20 },
                { header: 'Aforo', key: 'Aforo', width: 15 },
                { header: 'Código Docente', key: 'ID_Docente', width: 20 },
                { header: 'Nombre Docente', key: 'Nombre_Docente', width: 38 },
                { header: 'Estado Docente', key: 'Aprobacion_Docente', width: 20 }
            ];


            // Añadir los datos
            DashFiltro.forEach(dato => sheetClases.addRow(dato));

            // Aplicar los estilos
            aplicarEstilosExcel(sheetClases);

            // Crear el directorio temporal si no existe
            const dirPath = path.join(__dirname, '../temp');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }

            // Guardar el archivo Excel en una ubicación temporal
            const filePath = `${dirPath}/Informe_Dash_Filtro_${Estado}_${Date.now()}.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            return {filePath};
        }
    } catch (error) {
        console.error('Error al generar el informe de uso de espacio:', error);
        throw error;
    }
};
