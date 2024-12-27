import { IReserva } from '../types';
import Servicio from './Servicio';  // Importar el modelo de Servicio
import Plan from './Plan';  // Importar el modelo de Plan
import Huesped from './Huesped';  // Importar el modelo de Huesped
import Habitacion from './Habitacion';  // Importar el modelo de Habitacion
import dayjs from 'dayjs';

let reservaIdCounter = 1;

export default class Reserva {
  reservaId: number;
  numeroHuespedes: number;
  precioDePlan: number;
  cantidadNoches: number;
  fechaInicio: string;
  fechaFinal: string;
  fechaCreacion: string;
  habitacionId: number;
  huespedId: number;
  planId: number;
  servicioId: number;
  static createRandom: any;

  // Constructor que recibe los parámetros directamente
  constructor(
    numeroHuespedes: number,
    precioDePlan: number,
    cantidadNoches: number,
    fechaInicio: string,
    habitacionId: number | Habitacion, // Acepta número o instancia de Habitacion
    huespedId: number | Huesped, // Acepta número o instancia de Huesped
    planId: number | Plan, // Acepta número o instancia de Plan
    servicioId: number | Servicio, // Acepta número o instancia de Servicio
    fechaCreacion?: string
  );
  // Constructor que recibe un objeto que respeta la interface
  constructor(reserva: Omit<IReserva, 'reservaId'>);
  // Implementación del constructor
  constructor(
    reservaOrParams: Omit<IReserva, 'reservaId' | 'fechaFinal'> | number,
    precioDePlan?: number,
    cantidadNoches?: number,
    fechaInicio?: string,
    habitacionIdOrInstancia?: number | Habitacion, // Acepta número o instancia de Habitacion
    huespedIdOrInstancia?: number | Huesped, // Acepta número o instancia de Huesped
    planIdOrInstancia?: number | Plan, // Acepta número o instancia de Plan
    servicioIdOrInstancia?: number | Servicio, // Acepta número o instancia de Servicio
    fechaCreacion?: string
  ) {
    this.reservaId = reservaIdCounter++;

    // Asignación de otros parámetros
    if (typeof reservaOrParams === 'number') {
      this.numeroHuespedes = reservaOrParams;
      this.precioDePlan = precioDePlan!;
      this.cantidadNoches = cantidadNoches!;
      this.fechaInicio = fechaInicio!;
      this.fechaFinal = dayjs(fechaInicio).add(cantidadNoches!, 'day').format('YYYY-MM-DD');
      this.fechaCreacion = fechaCreacion || new Date().toISOString();
      // Llamadas a las funciones privadas para resolver los IDs
      this.servicioId = this.resolveServicioId(servicioIdOrInstancia!);
      this.planId = this.resolvePlanId(planIdOrInstancia!);
      this.huespedId = this.resolveHuespedId(huespedIdOrInstancia!);
      this.habitacionId = this.resolveHabitacionId(habitacionIdOrInstancia!);
    } else {
      this.numeroHuespedes = reservaOrParams.numeroHuespedes;
      this.precioDePlan = reservaOrParams.precioDePlan;
      this.cantidadNoches = reservaOrParams.cantidadNoches;
      this.fechaInicio = reservaOrParams.fechaInicio;
      this.fechaFinal = dayjs(reservaOrParams.fechaInicio).add(reservaOrParams.cantidadNoches, 'day').format('YYYY-MM-DD');
      this.fechaCreacion = reservaOrParams.fechaCreacion || new Date().toISOString();
      this.servicioId = reservaOrParams.servicioId;
      this.planId = reservaOrParams.planId;
      this.huespedId = reservaOrParams.huespedId;
      this.habitacionId = reservaOrParams.habitacionId;
    }
  }

  // Método privado para resolver el servicioId
  private resolveServicioId(servicioIdOrInstancia: number | Servicio): number {
    // Si es una instancia de Servicio, obtenemos el ID
    if (servicioIdOrInstancia instanceof Servicio) {
        return servicioIdOrInstancia.getId();
    }

    return servicioIdOrInstancia;
  }

  // Método privado para resolver el planId
  private resolvePlanId(planIdOrInstancia: number | Plan): number {
    if (planIdOrInstancia instanceof Plan) {
      return planIdOrInstancia.getId();
    }
    return planIdOrInstancia!;
  }

  // Método privado para resolver el huespedId
  private resolveHuespedId(huespedIdOrInstancia: number | Huesped): number {
    if (huespedIdOrInstancia instanceof Huesped) {
      return huespedIdOrInstancia.getId();
    }
    return huespedIdOrInstancia!;
  }

  // Método privado para resolver el habitacionId
  private resolveHabitacionId(habitacionIdOrInstancia: number | Habitacion): number {
    if (habitacionIdOrInstancia instanceof Habitacion) {
      return habitacionIdOrInstancia.getId();
    }
    return habitacionIdOrInstancia!;
  }

  // Método público para obtener el ID de la reserva
  getId(): number {
    return this.reservaId;
  }

  // Método que genera el SQL para insertar la reserva en la base de datos
  toSQL(): string {
    return `
      INSERT INTO reserva
        (reserva_id, numero_huespedes, precio_de_plan, cantidad_noches, fecha_inicio, fecha_final, fecha_creacion, habitacion_id, huesped_id, plan_id, servicio_id)
        VALUES
        (${this.reservaId}, ${this.numeroHuespedes}, ${this.precioDePlan}, ${this.cantidadNoches}, '${this.fechaInicio}', '${this.fechaFinal}', '${this.fechaCreacion}', ${this.habitacionId}, ${this.huespedId}, ${this.planId}, ${this.servicioId});
    `;
  }
}
