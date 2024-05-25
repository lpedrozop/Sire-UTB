import ExcelJS from 'exceljs';

export const aplicarEstilosExcel = (sheet) => {
    // Estilo para las celdas del encabezado
    sheet.getRow(1).eachCell((cell) => {
        cell.style = {
            font: { name: 'Times New Roman', size: 12, bold: true },
            alignment: { vertical: 'middle', horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '3293FF' } },
            border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        };
    });

    // Estilo para las celdas de los datos
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber !== 1) {
            row.eachCell((cell) => {
                cell.style = {
                    font: { name: 'Times New Roman', size: 11, bold: true },
                    alignment: { vertical: 'middle', horizontal: 'center' },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: rowNumber % 2 === 0 ? 'FFFFFF' : 'A2CEFF' } },
                    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                };
            });
        }
    });
};
