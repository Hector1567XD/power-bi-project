import { IReserva } from '../types';
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
  habitacion: Habitacion;
  static createRandom: any;

  // Constructor que recibe los parámetros directamente
  constructor(
    numeroHuespedes: number,
    precioDePlan: number,
    cantidadNoches: number,
    fechaInicio: string,
    habitacionId: Habitacion, // Acepta número o instancia de Habitacion
    huespedId: number | Huesped, // Acepta número o instancia de Huesped
    planId: number | Plan, // Acepta número o instancia de Plan
    fechaCreacion?: string
  );
  // Implementación del constructor
  constructor(
    numeroHuespedes: number,
    precioDePlan?: number,
    cantidadNoches?: number,
    fechaInicio?: string,
    habitacionIdOrInstancia?: Habitacion, // Acepta número o instancia de Habitacion
    huespedIdOrInstancia?: number | Huesped, // Acepta número o instancia de Huesped
    planIdOrInstancia?: number | Plan, // Acepta número o instancia de Plan
    fechaCreacion?: string
  ) {
    this.reservaId = reservaIdCounter++;

    // Asignación de otros parámetros
    this.numeroHuespedes = numeroHuespedes;
    this.precioDePlan = precioDePlan!;
    this.cantidadNoches = cantidadNoches!;
    this.fechaInicio = fechaInicio!;
    this.fechaFinal = dayjs(fechaInicio).add(cantidadNoches!, 'day').format('YYYY-MM-DD');
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
    // Llamadas a las funciones privadas para resolver los IDs
    this.planId = this.resolvePlanId(planIdOrInstancia!);
    this.huespedId = this.resolveHuespedId(huespedIdOrInstancia!);
    this.habitacionId = habitacionIdOrInstancia!.getId();
    this.habitacion = habitacionIdOrInstancia!;
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

  // Método público para obtener el ID de la reserva
  getId(): number {
    return this.reservaId;
  }

  // Método que genera el SQL para insertar la reserva en la base de datos
  toSQL(): string {
    return `
      INSERT INTO reserva
        (reserva_id, numero_huespedes, precio_de_plan, cantidad_noches, fecha_inicio, fecha_final, fecha_creacion, habitacion_id, huesped_id, plan_id)
        VALUES
        (${this.reservaId}, ${this.numeroHuespedes}, ${this.precioDePlan}, ${this.cantidadNoches}, '${this.fechaInicio}', '${this.fechaFinal}', '${this.fechaCreacion}', ${this.habitacionId}, ${this.huespedId}, ${this.planId});
    `;
  }
}
