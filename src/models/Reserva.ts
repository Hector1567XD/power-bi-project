import { IReserva, Satisfaccion } from '../types';
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
  huesped: Huesped;
  planId: number;
  habitacion: Habitacion;
  satisfaccion: Satisfaccion | null = null;
  static createRandom: any;

  // Constructor que recibe los parámetros directamente
  constructor(
    numeroHuespedes: number,
    precioDePlan: number,
    cantidadNoches: number,
    fechaInicio: string,
    habitacionId: Habitacion, // Acepta número o instancia de Habitacion
    huespedId: Huesped, // Acepta número o instancia de Huesped
    planId: number | Plan, // Acepta número o instancia de Plan
    fechaCreacion?: string
  );
  // Implementación del constructor
  constructor(
    numeroHuespedes: number,
    precioDePlan: number,
    cantidadNoches: number,
    fechaInicio: string,
    habitacionIdOrInstancia: Habitacion, // Acepta número o instancia de Habitacion
    huespedInstancia: Huesped, // Acepta número o instancia de Huesped
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
    this.huespedId = this.resolveHuespedId(huespedInstancia!);
    this.huesped = huespedInstancia!;
    this.habitacionId = habitacionIdOrInstancia!.getId();
    this.habitacion = habitacionIdOrInstancia!;

    // Asignación de la satisfacción
    this.satisfaccion = null;
    // Probabilidad del 10% de dejar la satisfaccion en null, o de ponerla en un valor aleatorio entre 1 y 10
    if (Math.random() < 0.1) {
      const rand = Math.random();
      if (rand < 0.15) {
      this.satisfaccion = Satisfaccion.Satisfecho; // 15% chance to be Satisfecho
      } else if (rand < 0.4) {
      this.satisfaccion = Satisfaccion.MuySatisfecho; // 25% chance to be MuySatisfecho
      } else if (rand < 0.7) {
      this.satisfaccion = Satisfaccion.Neutral; // 30% chance to be Neutral
      } else if (rand < 0.9) {
      this.satisfaccion = Satisfaccion.Insatisfecho; // 20% chance to be Insatisfecho
      } else {
      this.satisfaccion = Satisfaccion.MuyInsatisfecho; // 10% chance to be MuyInsatisfecho
      }
    }
  }

  public getFechaInicio(): string {
    return this.fechaInicio;
  }

  public getSatisfaccion(): Satisfaccion | null {
    return this.satisfaccion;
  }

  public getHuesped(): Huesped {
    return this.huesped;
  }

  // Método privado para resolver el planId
  private resolvePlanId(planIdOrInstancia: number | Plan): number {
    if (planIdOrInstancia instanceof Plan) {
      return planIdOrInstancia.getId();
    }
    return planIdOrInstancia!;
  }

  // Método privado para resolver el huespedId
  private resolveHuespedId(huespedInstancia: Huesped): number {
    if (huespedInstancia instanceof Huesped) {
      return huespedInstancia.getId();
    }
    return huespedInstancia!;
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
