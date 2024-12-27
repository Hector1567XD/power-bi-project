import fs from 'fs';
import readline from 'readline';
import { Client } from 'pg';
import dotenv from 'dotenv';
import ProgressBar from 'progress';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos desde .env
const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Método estático para cargar el archivo SQL desde la ruta base del proyecto
const loadSQLFile = (): string => {
  const BASE_DIR = path.resolve(__dirname, '../'); // Esto apunta al directorio raíz del proyecto
  const sqlFilePath = path.join(BASE_DIR, 'sql', 'output.sql');
  return sqlFilePath; // Retorna la ruta completa al archivo SQL
};

// Filtrar comentarios y líneas vacías
const filterLines = (line: string): boolean => {
  return line.trim() !== '' && !line.trim().startsWith('--'); // Filtra comentarios y líneas vacías
};

// Procesar un batch de líneas SQL y manejar los errores
const processBatch = async (sqlBatch: string, progressBar: ProgressBar, batchCounter: number, ignoreDuplicates: boolean) => {
  try {
    if (sqlBatch) {
      await client.query(sqlBatch);
      progressBar.tick(batchCounter);
    }
  } catch (error: any) {
    if (error.code === '42P07') { // Error de tabla ya existe
      console.log('El esquema ya fue creado. Deteniendo la importación.');
      process.exit(1);
    } else if (error.code === '23505' && ignoreDuplicates) { // Error de duplicado
      console.warn(`Advertencia: El valor en la columna ${error.constraint} ya existe. Omitiendo el registro.`);
    } else if (error.code === '23505' && !ignoreDuplicates) { // Si no ignoramos duplicados, fallamos
      console.error('Error de duplicado encontrado:', error);
      throw error;
    } else {
      console.error('Error al ejecutar el batch:', error);
      throw error; // Otros errores los lanzamos
    }
  }
};

const importSQLFile = async (batchSize: number = 1000, ignoreDuplicates: boolean = false) => {
  const filePath = loadSQLFile(); // Cargamos la ruta del archivo SQL
  const fileContent = fs.readFileSync(filePath, 'utf-8'); // Leer todo el contenido del archivo

  // Dividir el archivo en comandos SQL usando ';' como delimitador
  const allLines = fileContent.split(';').map(line => line.trim()).filter(line => filterLines(line));

  console.log('Existen lineas:')
  console.log(allLines.length);

  // Inicializamos la barra de progreso con el número total de líneas
  const progressBar = new ProgressBar('Importando [:bar] :percent :current/:total :etas', {
    total: allLines.length,
    width: 40,
    complete: '=',
    incomplete: ' ',
  });

  console.log('Conectando a la base de datos...');
  try {
    await client.connect();
    console.log('Conexión exitosa.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Terminar el script si no se puede conectar
  }

  console.log('Comenzando a procesar líneas SQL...');
  let sqlBatch = '';
  let batchCounter = 0;
  let totalLines = 0;
  let lineaEspecifica = 0;

  try {
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];

      //console.log(allLines[i]);
      // Agregar la línea al batch
      sqlBatch += line + ';'; // Asegurarse de agregar el delimitador al final
      lineaEspecifica++;
      batchCounter++;
      if (batchCounter >= batchSize || i === allLines.length - 1) {
        await processBatch(sqlBatch, progressBar, batchCounter, ignoreDuplicates);
        sqlBatch = ''; // Reiniciar el batch
        batchCounter = 0; // Reiniciar el contador de líneas del batch
        totalLines += batchCounter;
      }
    }
  } catch (error) {
    console.error('Error al ejecutar el batch:', error);
    console.log('Batch:', batchCounter);
    console.log('Linea procesadas:', totalLines);
    console.log('Linea especifica procesada:', lineaEspecifica);
    //console.log('SQL batch:', sqlBatch);
  } finally {
    console.log('Importación completa.');
    await client.end();
  }
};

// Llama al script con el tamaño del batch y un booleano para ignorar duplicados
const ignoreDuplicates = false; // Cambia esto a `true` si quieres ignorar duplicados
importSQLFile(200, ignoreDuplicates).catch(console.error);
