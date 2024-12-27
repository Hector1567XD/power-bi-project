
import { faker } from '@faker-js/faker';  // Importar faker
import Pais from "./models/Pais";
import Sucursal from "./models/Sucursal";  // Asegúrate de tener un modelo Sucursal
import { Continentes, TemporadaType as TP } from "./types";
import Processor from './processor';
import createDataSucursal from './algoritmos/create-data-sucursal';
import Huesped from './models/Huesped';
import Reserva from './models/Reserva';

// Instanciando el procesador
const processor = new Processor();

// Leer el archivo SQL con el método estático loadSQLFile
const sqlFileContent = Processor.loadSQLFile();

let sucursales: Sucursal[] = [];
let huespedesAndReservas: (Huesped | Reserva)[] = [];

// Ejecutar las entidades y obtener el SQL de inserciones
const sqlInsertions = processor.run([
  new Pais(Continentes.AmericaDelNorte, 'EE. UU.', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.B, TP.B, TP.N, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),
  new Pais(Continentes.AmericaDelNorte, 'México', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.B, TP.A, TP.A, TP.A, TP.A, TP.A, TP.B, TP.B, TP.B, TP.A]),
  
  new Pais(Continentes.Europa, 'España', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.A, TP.A, TP.A, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.B]),
  
  new Pais(Continentes.Europa, 'Francia', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.A, TP.A, TP.A, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.B]),
  
  new Pais(Continentes.Asia, 'Japón', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.A, TP.A, TP.A, TP.A, TP.B, TP.B, TP.B, TP.B, TP.B, TP.B]),
  
  new Pais(Continentes.Asia, 'China', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.A, TP.A, TP.N, TP.N, TP.N, TP.N, TP.A, TP.A, TP.B, TP.B]),
  
  new Pais(Continentes.Oceanía, 'Australia', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.B, TP.B, TP.B, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),
  
  new Pais(Continentes.Africa, 'Sudáfrica', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.B, TP.B, TP.B, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),
  
  new Pais(Continentes.AmericaDelSur, 'Brasil', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.B, TP.B, TP.N, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),
  
  new Pais(Continentes.AmericaDelSur, 'Argentina', undefined, (pais: Pais) => {
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
    sucursales.push(
      Sucursal.createRandom(pais, (sucursal) => {
        huespedesAndReservas.push(...createDataSucursal(sucursal));
      }),
    );
  }, [TP.B, TP.B, TP.B, TP.B, TP.B, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),
  
  ...sucursales,
  ...huespedesAndReservas,
]);

// Imprimir el contenido del archivo y el SQL generado
/*console.log(sqlFileContent);
console.log(sqlInsertions);*/

// Exportar el SQL generado (creación de tablas y datos) a un archivo output.sql
Processor.exportToSQLFile('../sql/output.sql', sqlFileContent, sqlInsertions);
