import ExcelJS from 'exceljs';
import dotenv from 'dotenv';
import path from 'path';
import Reserva from './models/Reserva';

// Cargar variables de entorno
dotenv.config();

export default class ExcelSatisfactionExport {
  static async exportExcelSatisfaccion(reservas: Reserva[], writeBatchSize = 1000) {
    try {
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Satisfaccion');

      // Definir encabezados de las columnas
      worksheet.columns = [
        { header: 'ReservaId', key: 'reservaId', width: 15 },
        { header: 'Cedula', key: 'cedula', width: 20 },
        { header: 'Fecha de Encuesta', key: 'fechaEncuesta', width: 20 },
        { header: 'Satisfaccion', key: 'satisfaccion', width: 15 },
      ];

      // Filtrar reservas con satisfacción no nula y preparar los datos
      const filteredReservas = reservas.filter((reserva) => reserva.getSatisfaccion() !== null);

      // Procesar las reservas en lotes para escribir en el Excel
      for (let i = 0; i < filteredReservas.length; i += writeBatchSize) {
        const batch = filteredReservas.slice(i, i + writeBatchSize);
        const rows = batch.map((reserva) => {
          const huesped = reserva.getHuesped();
          const persona = huesped.getPersona();
          return {
            reservaId: reserva.getId(),
            cedula: persona.cedula, // Asumiendo que "cedula" es una propiedad de Persona
            fechaEncuesta: reserva.getFechaInicio(),
            satisfaccion: reserva.getSatisfaccion(),
          };
        });
        worksheet.addRows(rows);
      }

      // Guardar el archivo Excel en BASE_DIR/excel/satisfaccion-reservas.xlsx
      const BASE_DIR = path.resolve(__dirname, '../'); // Directorio raíz del proyecto
      const excelFilePath = path.join(BASE_DIR, 'excel', 'satisfaccion-reservas.xlsx');

      await workbook.xlsx.writeFile(excelFilePath);
      console.log(`Archivo Excel guardado en: ${excelFilePath}`);
    } catch (error) {
      console.error('Error al generar el archivo Excel:', error);
    }
  }
}
