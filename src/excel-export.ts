import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import ExcelJS from 'exceljs';
import dotenv from 'dotenv';
import ProgressBar from 'progress';
import { CONTINENTES, Continentes, CONTINENTES_FILE_NAME_PATH } from './types';

// Cargar variables de entorno
dotenv.config();
const CONTINENTAL_SEPARATION_MODE = process.env.CONTINENTAL_SEPARATION_MODE === 'true';

// Definir la clase con un método estático
class DatabaseExporter {

  // Método estático para leer el archivo SQL desde la ruta base del proyecto
  static loadSQLFile(): string {
    const BASE_DIR = path.resolve(__dirname, '../'); // Esto apunta al directorio raíz del proyecto
    const sqlFilePath = path.join(BASE_DIR, 'sql', 'tables-creation.sql');
    return this.readSQLFile(sqlFilePath);
  }

  // Método para leer el archivo SQL
  static readSQLFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  // Función para exportar una tabla en batches
  static async exportTableInBatches(continent: Continentes | null, tableName: string, workbook: ExcelJS.Workbook, batchSize: number = 1000) {
    const continentePath = continent ? CONTINENTES_FILE_NAME_PATH[continent] : null;

    const client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: continentePath ? `${process.env.DB_NAME}_${continentePath}` : process.env.DB_NAME,
    });

    try {
      console.log('Conectando a la base de datos...');
      console.log('Exportacion de tabla ', tableName);
      await client.connect();
      console.log('Conexión exitosa.');

      const worksheet = workbook.addWorksheet(tableName);  // Agregar nueva hoja para la tabla

      // Consultar los nombres de las columnas
      const columnQuery = `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`;
      const columnResult = await client.query(columnQuery);

      // Agregar encabezados de la tabla
      worksheet.columns = columnResult.rows.map(row => ({
        header: row.column_name,
        key: row.column_name,
      }));

      let offset = 0;
      let totalRows: number;
      let progressBar: ProgressBar | null = null;

      // Obtener el total de filas de la tabla
      const totalCountQuery = `SELECT COUNT(*) FROM ${tableName}`;
      const totalCountResult = await client.query(totalCountQuery);
      totalRows = parseInt(totalCountResult.rows[0].count);

      // Inicializar la barra de progreso
      progressBar = new ProgressBar('Exportando [:bar] :percent :current/:total :etas', {
        total: totalRows,
        width: 40,
        complete: '=',
        incomplete: ' ',
      });

      // Exportar los datos en batches
      while (offset < totalRows) {
        const query = `SELECT * FROM ${tableName} LIMIT ${batchSize} OFFSET ${offset}`;
        const result = await client.query(query);

        // Agregar las filas de este batch
        result.rows.forEach(row => worksheet.addRow(row));

        // Actualizar la barra de progreso
        progressBar?.tick(batchSize);

        // Aumentar el offset para el siguiente batch
        offset += batchSize;
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      await client.end();
      console.log('Conexión cerrada.');
    }
  }

  // Función para exportar todas las tablas en batches
  static async exportAllTablesInBatches(continent: Continentes | null, tableNames: string[], outputPath: string) {
    const workbook = new ExcelJS.Workbook();

    for (let tableName of tableNames) {
      console.log('---------->', tableName);
      await this.exportTableInBatches(continent, tableName, workbook, +(process.env.BATCH_SIZE_EXPORT || ''));
    }

    // Guardar el archivo Excel con todas las tablas
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Archivo Excel generado: ${outputPath}`);
  }
}

// Función que puede ser importada y utilizada en otros módulos
export async function exportDatabaseToExcel(continent: Continentes | null, tableNames: string[], outputDir: string) {
  const continentePath = continent ? CONTINENTES_FILE_NAME_PATH[continent] : null;

  const outputPath = continentePath 
    ? path.join(outputDir, continentePath, `${continentePath}-all-output.xlsx`)
    : path.join(outputDir, 'todas-las-tablas-output.xlsx');

  // Crear la carpeta de salida si no existe
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  // Ejecutar la función para exportar todas las tablas en batches en un solo archivo
  await DatabaseExporter.exportAllTablesInBatches(continent, tableNames, outputPath);
}

export async function executeAllDatabasesToExcel() {
  // Nombres de las tablas que se van a exportar
  const tableNames = [
    'paises',
    'persona',
    'empleado',
    'huesped',
    'sucursal',
    'planes',
    'servicio',
    'habitacion',
    'reserva',
    'reserva_servicio'
  ];

  // Directorio donde se guardará el archivo Excel con todas las tablas
  const outputDir = path.resolve(__dirname, '../excel');

  // Ejecutar la función de exportación
  await exportDatabaseToExcel(null, tableNames, outputDir).catch(console.error);
  if (CONTINENTAL_SEPARATION_MODE) {
    const proccess = CONTINENTES.map(async (continente: Continentes) => {
      console.log('---==========================->', continente);
      await exportDatabaseToExcel(continente, tableNames, outputDir).catch(console.error);
    });
    // Ejecuta todos los procesos UNO DETRAS DEL OTRO, no todos a la vez
    for (const p of proccess) {
      await p;
    }
  }
}

// Si este archivo es ejecutado directamente (no importado), se ejecuta el código siguiente
if (require.main === module) {
  executeAllDatabasesToExcel();
}