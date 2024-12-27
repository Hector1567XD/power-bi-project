
import { faker } from '@faker-js/faker';  // Importar faker
import Pais from "./models/Pais";
import Sucursal from "./models/Sucursal";  // Asegúrate de tener un modelo Sucursal
import { Continentes } from "./types";
import Processor from './processor';

// Instanciando el procesador
const processor = new Processor();

// Leer el archivo SQL con el método estático loadSQLFile
const sqlFileContent = Processor.loadSQLFile();

let sucursales: Sucursal[] = [];

// Ejecutar las entidades y obtener el SQL de inserciones
const sqlInsertions = processor.run([
  new Pais(Continentes.AmericaDelNorte, 'EE. UU.', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id), Sucursal.createRandom(id), Sucursal.createRandom(id));
  }),
  new Pais(Continentes.AmericaDelNorte, 'México', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
  }),
  new Pais(Continentes.Europa, 'España', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
  }),
  new Pais(Continentes.Europa, 'Francia', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
    sucursales.push(Sucursal.createRandom(id));
  }),
  new Pais(Continentes.Asia, 'Japón', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
  }),
  new Pais(Continentes.Asia, 'China', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
  }),
  new Pais(Continentes.Oceanía, 'Australia', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
    sucursales.push(Sucursal.createRandom(id));
  }),
  new Pais(Continentes.Africa, 'Sudáfrica', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
  }),
  new Pais(Continentes.AmericaDelSur, 'Brasil', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
  }),
  new Pais(Continentes.AmericaDelSur, 'Argentina', undefined, (id: number) => {
    sucursales.push(Sucursal.createRandom(id));
    sucursales.push(Sucursal.createRandom(id));
  }),
  ...sucursales,
]);

// Imprimir el contenido del archivo y el SQL generado
console.log(sqlFileContent);
console.log(sqlInsertions);

// Exportar el SQL generado (creación de tablas y datos) a un archivo output.sql
Processor.exportToSQLFile('../sql/output.sql', sqlFileContent, sqlInsertions);