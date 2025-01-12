import { generateAndExportData } from './feeder';
import { executeAllDatabasesToExcel, exportDatabaseToExcel } from './excel-export';
import { importSQLFile } from './importer-script';
import { executeCustomQuery } from './custom-query';
import figlet from 'figlet';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();


// Función para mostrar el arte ASCII del gato
const showCat = (step: number) => {
  let catArt = '';

  switch (step) {
    case 1:
      catArt = `
        /\_/\\  
       ( o.o ) 
        > ^ <   PASO 1/4 - Iniciando proceso feeder...
      `;
      break;
    case 2:
      catArt = `
        /\_/\\  
       ( -.- ) 
        > ^ <   PASO 2/4 - Iniciando migración a BDD...
      `;
      break;
    case 3:
      catArt = `
        /\_/\\  
       ( ^.^ ) 
        > ^ <   PASO 3/4 - Exportando a Excel...
      `;
      break;
    case 4:
      catArt = `
        /\_/\\  
       ( >^.^< ) 
        > ^ <   PASO 4/4 - Ejecutando consulta personalizada...
      `;
      break;
    default:
      catArt = `Cat is taking a nap...`;
  }
  
  console.log(figlet.textSync('Miau!', { horizontalLayout: 'full' }));
  console.log(catArt);
};

// Función para ejecutar los pasos
const runProcess = async () => {
  console.log("Bienvenido al proceso de migración y exportación!");

  // Paso 1/4: Iniciar proceso feeder
  showCat(1);
  await generateAndExportData();

  // Paso 2/4: Iniciar migración a base de datos
  showCat(2);
  const ignoreDuplicates = false;
  await importSQLFile(+(process.env.BATCH_SIZE_IMPORT || ''), ignoreDuplicates);  // Asumiendo que importSQLFile es una función asíncrona

  // Paso 3/4: Exportar a Excel
  showCat(3);

  await executeAllDatabasesToExcel();  // Asumiendo que exportDatabaseToExcel es una función asíncrona

  // Paso 4/4: Ejecutar consulta personalizada si está activada
  showCat(4);
  await executeCustomQuery();

  console.log('¡Proceso completado con éxito! 🎉');
};

// Ejecutar el proceso
runProcess().catch((err) => {
  console.error('Error en el proceso:', err);
});
