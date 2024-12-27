import Pais from "./models/Pais";
import Processor from "./processor";
import { Continentes } from "./types";


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