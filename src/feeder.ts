import { faker } from '@faker-js/faker';  // Importar faker
import Pais from "./models/Pais";
import Sucursal from "./models/Sucursal";  // Asegúrate de tener un modelo Sucursal
import { Continentes, TemporadaType as TP } from "./types";
import Processor from './processor';
import createDataSucursal from './algoritmos/create-data-sucursal';
import Huesped from './models/Huesped';
import Reserva from './models/Reserva';
import ReservaServicio from './models/ReservaServicio';

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

type EntitySQL = Sucursal | Huesped | Reserva | ReservaServicio | Pais;
type ContinentalSQL = Record<Continentes, EntitySQL[]>;

class CollectionSQLs {
  private static continentalSqls: ContinentalSQL = {
    [Continentes.Africa]: [],
    [Continentes.Asia]: [],
    [Continentes.Europa]: [],
    [Continentes.AmericaDelNorte]: [],
    [Continentes.AmericaDelSur]: [],
    [Continentes.Oceanía]: [],
    [Continentes.Antartida]: [],
  };

  static addOnStart(continentes: Continentes, ...sqls: EntitySQL[]) {
    this.continentalSqls[continentes].unshift(...sqls);
  }

  static add(continentes: Continentes, ...sqls: EntitySQL[]) {
    this.continentalSqls[continentes].push(...sqls);
  }

  static getAllEntities(): EntitySQL[] {
    return Object.values(this.continentalSqls).flat();
  }

  static getContinentEntities(continent: Continentes): EntitySQL[] {
    return this.continentalSqls[continent];
  }
}

// Función principal para generar y exportar los datos
export const generateAndExportData = async () => {
  // Instanciando el procesador
  const processor = new Processor();

  // Leer el archivo SQL con el método estático loadSQLFile
  const sqlFileContent = Processor.loadSQLFile();

  let sucursales: Sucursal[] = [];
  let huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];

  // Ejecutar las entidades y obtener el SQL de inserciones

  CollectionSQLs.addOnStart(
    Continentes.AmericaDelNorte,
    new Pais(Continentes.AmericaDelNorte, 'EE. UU.', undefined, (pais: Pais) => {

      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];

      const sucursales: Sucursal[] = [
        Sucursal.createRandom(pais, 'Nueva York', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
        Sucursal.createRandom(pais, 'Chicago', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
        Sucursal.createRandom(pais, 'Chicago', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      ];

      CollectionSQLs.add(Continentes.AmericaDelNorte, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.B, TP.B, TP.N, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),
    new Pais(Continentes.AmericaDelNorte, 'México', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Ciudad de México', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.AmericaDelNorte, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.B, TP.A, TP.A, TP.A, TP.A, TP.A, TP.B, TP.B, TP.B, TP.A]),
  );

  CollectionSQLs.addOnStart(
    Continentes.Europa,
    new Pais(Continentes.Europa, 'España', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Madrid', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.Europa, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.A, TP.A, TP.A, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.B]),
    new Pais(Continentes.Europa, 'Francia', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Paris', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );
      sucursales.push(
        Sucursal.createRandom(pais, 'Niza', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.Europa, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.A, TP.A, TP.A, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.B])
  );

  CollectionSQLs.addOnStart(
    Continentes.Asia,
    new Pais(Continentes.Asia, 'Japón', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Tokio', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.Asia, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.A, TP.A, TP.A, TP.A, TP.B, TP.B, TP.B, TP.B, TP.B, TP.B]),

    new Pais(Continentes.Asia, 'China', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Nankín', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.Asia, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.A, TP.A, TP.N, TP.N, TP.N, TP.N, TP.A, TP.A, TP.B, TP.B]),
  );

  CollectionSQLs.addOnStart(
    Continentes.Oceanía,
    new Pais(Continentes.Oceanía, 'Australia', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Albany', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );
      sucursales.push(
        Sucursal.createRandom(pais, 'Adelaida', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.Oceanía, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.B, TP.B, TP.B, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),
  );

  CollectionSQLs.addOnStart(
    Continentes.Africa,
    new Pais(Continentes.Africa, 'Sudáfrica', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Ciudad del Cabo', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );
      sucursales.push(
        Sucursal.createRandom(pais, 'Durban', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );
      sucursales.push(
        Sucursal.createRandom(pais, 'Ciudad del Cabo', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.Africa, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.B, TP.B, TP.B, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),
  );

  CollectionSQLs.addOnStart(
    Continentes.AmericaDelSur,
    new Pais(Continentes.AmericaDelSur, 'Brasil', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Río de Janeiro', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.AmericaDelSur, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.B, TP.B, TP.N, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A]),

    new Pais(Continentes.AmericaDelSur, 'Argentina', undefined, (pais: Pais) => {
      const huespedesAndReservas: (Huesped | Reserva | ReservaServicio)[] = [];
      const sucursales: Sucursal[] = [];

      sucursales.push(
        Sucursal.createRandom(pais, 'Buenos Aires', (sucursal) => {
          huespedesAndReservas.push(...createDataSucursal(sucursal));
        }),
      );

      CollectionSQLs.add(Continentes.AmericaDelSur, ...sucursales, ...huespedesAndReservas);
    }, [TP.B, TP.B, TP.B, TP.B, TP.B, TP.A, TP.A, TP.A, TP.N, TP.N, TP.B, TP.A])
  );

  const sqlInsertions = processor.run([
    ...CollectionSQLs.getAllEntities(),
  ]);

  // Exportar el SQL generado (creación de tablas y datos) a un archivo output.sql
  Processor.exportToSQLFile('../sql/output.sql', sqlFileContent, sqlInsertions);
};

// Si este archivo es ejecutado directamente (no importado), se ejecuta el código siguiente
if (require.main === module) {
  generateAndExportData().catch(console.error);
}
