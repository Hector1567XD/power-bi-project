import { IReservaServicio } from '../types';
import Reserva from './Reserva';  // Importar el modelo de Reserva
import Servicio from './Servicio';  // Importar el modelo de Servicio

let reservaServicioIdCounter = 1;

export default class ReservaServicio {
  reservaServicioId: number;
  reservaId: number;
  servicioId: number;
  price: number;
  fechaCreacion: string;

  // Constructor que recibe un objeto de tipo Reserva y Servicio
  constructor(reserva: Reserva, servicio: Servicio, fechaCreacion?: string, precio?: number);
  // Constructor que recibe un objeto que respeta la interface
  constructor(reservaServicio: Omit<IReservaServicio, 'reservaServicioId'>);
  // Implementación del constructor
  constructor(
    reservaOrParams: Reserva | Omit<IReservaServicio, 'reservaServicioId'>,
    servicioOrPrecio?: Servicio | number,
    fechaCreacion?: string,
    precio?: number,
  ) {
    this.reservaServicioId = reservaServicioIdCounter++;

    // Si el primer argumento es una instancia de Reserva (y Servicio si es necesario)
    if (reservaOrParams instanceof Reserva && servicioOrPrecio instanceof Servicio) {
      // Si es una instancia de Reserva y Servicio, asignamos sus valores
      const reserva = reservaOrParams as Reserva;
      const servicio = servicioOrPrecio as Servicio;

      this.reservaId = reserva.getId();
      this.servicioId = servicio.getId();
      this.price = precio ?? servicio.precio;  // Usamos el precio del servicio si no se pasa explícitamente
      this.fechaCreacion = fechaCreacion || new Date().toISOString();  // Fecha actual por defecto
    } else {
      // Si se pasa un objeto que respeta la interface IReservaServicio
      const reservaServicio = reservaOrParams as IReservaServicio;
      this.reservaId = reservaServicio.reservaId;
      this.servicioId = reservaServicio.servicioId;
      this.price = reservaServicio.price;
      this.fechaCreacion = reservaServicio.fechaCreacion || new Date().toISOString();
    }
  }

  // Método que genera el SQL para insertar la relación en la base de datos
  toSQL(): string {
    return `
      INSERT INTO reserva_servicio
        (reserva_servicio_id, reserva_id, servicio_id, price, fecha_creacion)
        VALUES
        (${this.reservaServicioId}, ${this.reservaId}, ${this.servicioId}, ${this.price}, '${this.fechaCreacion}');
    `;
  }
}
