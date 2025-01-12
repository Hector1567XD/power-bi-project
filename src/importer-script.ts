import fs from 'fs';
import readline from 'readline';
import { Client } from 'pg';
import dotenv from 'dotenv';
import ProgressBar from 'progress';
import path from 'path';
import { Continentes, CONTINENTES, CONTINENTES_FILE_NAME_PATH } from './types';

// Cargar variables de entorno
dotenv.config();
const CONTINENTAL_SEPARATION_MODE = process.env.CONTINENTAL_SEPARATION_MODE === 'true';

const clientsByContinent: Record<Continentes, Client | null> = {
  [Continentes.Africa]: null,
  [Continentes.Asia]: null,
  [Continentes.Europa]: null,
  [Continentes.AmericaDelNorte]: null,
  [Continentes.AmericaDelSur]: null,
  [Continentes.Oceanía]: null,
  [Continentes.Antartida]: null,
};

// Método estático para cargar el archivo SQL desde la ruta base del proyecto
const loadSQLFile = (continentePath: string | null): string => {
  const BASE_DIR = path.resolve(__dirname, '../'); // Esto apunta al directorio raíz del proyecto
  if (continentePath) {
    const sqlFilePath = path.join(BASE_DIR, 'sql', `${continentePath}`, `output-${continentePath}.sql`);
    return sqlFilePath; // Retorna la ruta completa al archivo SQL específico del continente
  } else {
    const sqlFilePath = path.join(BASE_DIR, 'sql', 'output.sql');
    return sqlFilePath; // Retorna la ruta completa al archivo SQL general
  }
};

// Filtrar comentarios y líneas vacías
const filterLines = (line: string): boolean => {
  return line.trim() !== '' && !line.trim().startsWith('--'); // Filtra comentarios y líneas vacías
};

// Función para borrar todas las tablas de la base de datos
const dropAllTables = async (client: Client) => {
  if (process.env.DROP_ALL_TABLES === 'true') {
    try {
      console.log('Borrando todas las tablas de la base de datos...');
      const res = await client.query(`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
      `);
      const tables = res.rows.map(row => row.table_name);
      for (const table of tables) {
        console.log(`Borrando tabla ${table}...`);
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      }
      console.log('Todas las tablas han sido borradas.');
    } catch (error) {
      console.error('Error al borrar las tablas:', error);
      process.exit(1); // Salir si ocurre un error
    }
  } else {
    console.log('No se borrarán las tablas. DROP_ALL_TABLES está en false.');
  }
};

// Procesar un batch de líneas SQL y manejar los errores
const processBatch = async (client: Client, sqlBatch: string, progressBar: ProgressBar, batchCounter: number, ignoreDuplicates: boolean) => {
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

// Función principal para importar el archivo SQL
export const importSQLFileWithClient = async (client: Client, continent: null | Continentes, batchSize: number = 1000, ignoreDuplicates: boolean = false) => {
  if (continent === null) {
    console.log('*Importing global database*');
  } else {
    console.log(`*Importing database for continent: ${continent}*`);
  }

  const continentePath = continent ? CONTINENTES_FILE_NAME_PATH[continent] : null;
  const filePath = loadSQLFile(continentePath); // Cargamos la ruta del archivo SQL
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

  // Borra las tablas si está habilitado en el .env
  await dropAllTables(client);

  console.log('Comenzando a procesar líneas SQL...');
  let sqlBatch = '';
  let batchCounter = 0;
  let totalLines = 0;
  let lineaEspecifica = 0;

  try {
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];

      // Agregar la línea al batch
      sqlBatch += line + ';'; // Asegurarse de agregar el delimitador al final
      lineaEspecifica++;
      batchCounter++;
      if (batchCounter >= batchSize || i === allLines.length - 1) {
        await processBatch(client, sqlBatch, progressBar, batchCounter, ignoreDuplicates);
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
  } finally {
    console.log('Importación completa.');
    await client.end();
  }
};

// Función principal para importar el archivo SQL
export const importSQLFile = async (batchSize: number = 1000, ignoreDuplicates: boolean = false) => {

  // Configuración de la base de datos desde .env
  const defaultClient = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await importSQLFileWithClient(defaultClient, null, batchSize, ignoreDuplicates);

  // Si el cliente deja de usarse, deberiamos liberar la conexion?
  defaultClient.end();

  if (CONTINENTAL_SEPARATION_MODE) {
    const proccess = CONTINENTES.map(async (continente: Continentes) => {

      const continentePath = CONTINENTES_FILE_NAME_PATH[continente];

      clientsByContinent[continente] = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: `${process.env.DB_NAME}_${continentePath}`,
      });

      await importSQLFileWithClient(clientsByContinent[continente], continente, batchSize, ignoreDuplicates);

      // Si el cliente deja de usarse, deberiamos liberar la conexion?
      clientsByContinent[continente].end();
    });

    // Ejecuta todos los procesos UNO DETRAS DEL OTRO, no todos a la vez
    for (const p of proccess) {
      await p;
    }
  }
};

// Si este archivo es ejecutado directamente (no importado), se ejecuta el código siguiente
if (require.main === module) {
  // Llama al script con el tamaño del batch y un booleano para ignorar duplicados
  const ignoreDuplicates = false; // Cambia esto a `true` si quieres ignorar duplicados
  importSQLFile(+(process.env.BATCH_SIZE_IMPORT || ''), ignoreDuplicates).catch(console.error);
}
