import { IServicio, TiposServicios } from '../types';

let servicioIdCounter = 1;

export default class Servicio {
  servicioId: number;
  nombreServicio: string;
  precio: number;
  fechaCreacion: string;
  sucursalId: number;

  // Constructor que recibe los parámetros directamente
  constructor(nombreServicio: string | TiposServicios, precio: number, sucursalId: number, fechaCreacion?: string);
  // Constructor que recibe un objeto que respeta la interface
  constructor(servicio: Omit<IServicio, 'servicioId'>);
  // Implementación del constructor
  constructor(servicioOrNombre: Omit<IServicio, 'servicioId'> | string | TiposServicios, precio?: number, sucursalId?: number, fechaCreacion?: string) {
    this.servicioId = servicioIdCounter++;

    if (typeof servicioOrNombre === 'string') {
      this.nombreServicio = servicioOrNombre.toString();
      this.precio = precio!;
      this.sucursalId = sucursalId!;
      this.fechaCreacion = fechaCreacion || new Date().toISOString();
    } else {
      this.nombreServicio = servicioOrNombre.nombreServicio;
      this.precio = servicioOrNombre.precio;
      this.sucursalId = servicioOrNombre.sucursalId;
      this.fechaCreacion = servicioOrNombre.fechaCreacion || new Date().toISOString();
    }
  }

  // Método público para obtener el ID del servicio
  getId(): number {
    return this.servicioId;
  }

  // Método que genera el SQL para insertar el servicio en la base de datos
  toSQL(): string {
    return `
      INSERT INTO servicio
        (servicio_id, nombre_servicio, precio, fecha_creacion, sucursal_id)
        VALUES
        (${this.servicioId}, '${this.nombreServicio}', ${this.precio}, '${this.fechaCreacion}', ${this.sucursalId});
    `;
  }
}
