import path from 'path';
import fs from 'fs';
import Pais from "./models/Pais";
import { Continentes } from "./types";

const FORMATEAR_SQL = false;  // Cambia a `false` si no quieres formato

class Processor {
  // Método para ejecutar las entidades y procesar el SQL
  run(entities: { toSQL: () => string }[]): string {
    let sql = entities.map(entity => entity.toSQL()).join('\n');

    if (!FORMATEAR_SQL) {
      // Elimina los saltos de línea y los espacios innecesarios si FORMATEAR_SQL es false
      sql = sql.replace(/\s+/g, ' ').trim();
    }

    return sql;
  }

  // Método estático para leer el archivo SQL y aplicar formato
  static readSQLFile(filePath: string): string {
    const sqlFileContent = fs.readFileSync(filePath, 'utf-8');

    if (!FORMATEAR_SQL) {
      // Elimina los saltos de línea y los espacios innecesarios si FORMATEAR_SQL es false
      return sqlFileContent.replace(/\s+/g, ' ').trim();
    }

    return sqlFileContent;  // Devuelve sin modificar si FORMATEAR_SQL es true
  }

  // Método estático para leer el archivo SQL desde la ruta base del proyecto
  static loadSQLFile(): string {
    // Define la constante BASE_DIR para la ruta base de tu proyecto
    const BASE_DIR = path.resolve(__dirname, '../'); // Esto apunta al directorio raíz del proyecto
    // Usa la constante BASE_DIR para construir la ruta al archivo SQL
    const sqlFilePath = path.join(BASE_DIR, 'sql', 'tables-creation.sql');
    
    // Leer el archivo SQL con el método estático
    return this.readSQLFile(sqlFilePath);
  }

  // Método estático para exportar el SQL generado a un archivo .sql
  static exportToSQLFile(fileName: string, creationSQL: string, dataSQL: string): void {
    const outputPath = path.join(__dirname, fileName); // Ruta donde se guardará el archivo .sql

    // Combina la creación de tablas con las inserciones de datos
    const content = `${creationSQL}\n\n${dataSQL}`;
    
    // Escribir el contenido en el archivo (sobrescribe si ya existe)
    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`Archivo SQL exportado a: ${outputPath}`);
  }
}

// Instanciando el procesador
const processor = new Processor();

// Leer el archivo SQL con el método estático loadSQLFile
const sqlFileContent = Processor.loadSQLFile();

// Ejecutar las entidades y obtener el SQL de inserciones
const sqlInsertions = processor.run([
  new Pais(Continentes.AmericaDelNorte, 'EE. UU.'),
  new Pais(Continentes.AmericaDelNorte, 'México'),
  new Pais(Continentes.Europa, 'España'),
  new Pais(Continentes.Europa, 'Francia'),
  new Pais(Continentes.Asia, 'Japón'),
  new Pais(Continentes.Asia, 'China'),
  new Pais(Continentes.Oceanía, 'Australia'),
  new Pais(Continentes.Africa, 'Sudáfrica'),
  new Pais(Continentes.AmericaDelSur, 'Brasil'),
  new Pais(Continentes.AmericaDelSur, 'Argentina'),
]);

// Imprimir el contenido del archivo y el SQL generado
console.log(sqlFileContent);
console.log(sqlInsertions);

// Exportar el SQL generado (creación de tablas y datos) a un archivo output.sql
Processor.exportToSQLFile('../sql/output.sql', sqlFileContent, sqlInsertions);