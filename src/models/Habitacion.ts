import { IHabitacion, TiposHabitaciones } from '../types';

let habitacionIdCounter = 1;

export default class Habitacion {
  habitacionId: number;
  tipoHabitacion: TiposHabitaciones;
  numeroMaxHuespedes: number;
  sucursalId: number;

  // Constructor que recibe los parámetros directamente
  constructor(tipoHabitacion: TiposHabitaciones, numeroMaxHuespedes: number, sucursalId: number);
  // Constructor que recibe un objeto que respeta la interface
  constructor(habitacion: Omit<IHabitacion, 'habitacionId'>);
  // Implementación del constructor
  constructor(habitacionOrTipo: Omit<IHabitacion, 'habitacionId'> | TiposHabitaciones, numeroMaxHuespedes?: number, sucursalId?: number) {
    this.habitacionId = habitacionIdCounter++;

    if (typeof habitacionOrTipo === 'string') {
      this.tipoHabitacion = habitacionOrTipo as TiposHabitaciones;
      this.numeroMaxHuespedes = numeroMaxHuespedes!;
      this.sucursalId = sucursalId!;
    } else {
      this.tipoHabitacion = habitacionOrTipo.tipoHabitacion;
      this.numeroMaxHuespedes = habitacionOrTipo.numeroMaxHuespedes;
      this.sucursalId = habitacionOrTipo.sucursalId;
    }
  }

  // Método público para obtener el ID de la habitación
  getId(): number {
    return this.habitacionId;
  }

  // Método que genera el SQL para insertar la habitación en la base de datos
  toSQL(): string {
    return `
      INSERT INTO habitacion
        (habitacion_id, tipo_habitacion, numero_max_huespedes, sucursal_id)
        VALUES
        (${this.habitacionId}, '${this.tipoHabitacion}', ${this.numeroMaxHuespedes}, ${this.sucursalId});
    `;
  }
}
