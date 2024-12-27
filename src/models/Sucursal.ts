import { ISucursal } from "../types";
import { faker } from '@faker-js/faker';  // Importar faker
import Pais from "./Pais";

// Variable de módulo para manejar el contador de IDs
let currentSucursalId = 1;

export default class Sucursal implements ISucursal {
  sucursalId: number;
  nombre: string;
  paisesId: number;
  fechaCreacion: string;

  constructor(nombre: string, paisesId: number | Pais, fechaCreacion: string) {
    // Asignamos el ID de sucursal desde el contador de módulo y lo incrementamos
    this.sucursalId = currentSucursalId++;
    this.nombre = nombre;

    // Verificamos si paisesId es un número o una instancia de Pais
    if (typeof paisesId === "number") {
      this.paisesId = paisesId;  // Si es número, asignamos directamente
    } else {
      this.paisesId = paisesId.paisesId;  // Si es una instancia de Pais, tomamos su paisesId
    }

    this.fechaCreacion = fechaCreacion;
  }

  // Método para generar el SQL de inserción de la sucursal
  toSQL(): string {
    return `
      INSERT INTO sucursal (sucursal_id, nombre, paises_id, fecha_creacion)
      VALUES (${this.sucursalId}, '${this.nombre}', ${this.paisesId}, '${this.fechaCreacion}');
    `;
  }

  // Método estático para crear una sucursal con datos aleatorios utilizando faker
  static createRandom(paisesId: number | Pais): Sucursal {
    const nombre = faker.company.name();
    const fechaCreacion = new Date().toISOString();  // Usamos la fecha actual en formato ISO para TIMESTAMPTZ
    return new Sucursal(nombre, paisesId, fechaCreacion);
  }
}
