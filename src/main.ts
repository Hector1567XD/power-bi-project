import { generateAndExportData } from './feeder';
import { exportDatabaseToExcel } from './excel-export';
import { importSQLFile } from './importer-script';

import figlet from 'figlet';
import path from 'path';

// Función para mostrar el arte ASCII del gato
const showCat = (step: number) => {
  let catArt = '';

  switch (step) {
    case 1:
      catArt = `
        /\_/\  
       ( o.o ) 
        > ^ <   PASO 1/3 - Iniciando proceso feeder...
      `;
      break;
    case 2:
      catArt = `
        /\_/\  
       ( -.- ) 
        > ^ <   PASO 2/3 - Iniciando migración a BDD...
      `;
      break;
    case 3:
      catArt = `
        /\_/\  
       ( ^.^ ) 
        > ^ <   PASO 3/3 - Exportando a Excel...
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

  // Paso 1/3: Iniciar proceso feeder
  showCat(1);
  await generateAndExportData();

  // Paso 2/3: Iniciar migración a base de datos
  showCat(2);
  const ignoreDuplicates = false;
  await importSQLFile(200, ignoreDuplicates);  // Asumiendo que importSQLFile es una función asíncrona

  // Paso 3/3: Exportar a Excel
  showCat(3);

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
    'reserva'
  ];

  // Directorio donde se guardará el archivo Excel con todas las tablas
  const outputDir = path.resolve(__dirname, '../excel');

  await exportDatabaseToExcel(tableNames, outputDir);  // Asumiendo que exportDatabaseToExcel es una función asíncrona

  console.log('¡Proceso completado con éxito! 🎉');
};

// Ejecutar el proceso
runProcess().catch((err) => {
  console.error('Error en el proceso:', err);
});
