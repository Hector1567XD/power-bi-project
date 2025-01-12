import path from 'path';
import fs from 'fs';

const FORMATEAR_SQL = false;  // Cambia a `false` si no quieres formato

export default class Processor {
  // Método para ejecutar las entidades y procesar el SQL
  static run(entities: { toSQL: () => string }[]): string {
    let sql = entities.map(entity => entity.toSQL()).join('\n');

    if (!FORMATEAR_SQL) {
      // Elimina los saltos de línea y los espacios innecesarios si FORMATEAR_SQL es false
      sql = sql.replace(/\s+/g, ' ').trim();
    }

    return sql;
  }

  static createFolderWhenNotExists(folderPath: string): void {
    const outputPath = path.resolve(__dirname, folderPath); // Ruta donde se creará la carpeta

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
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
  static loadTablesSQLFile(): string {
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
