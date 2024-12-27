import { IPlan, TiposPlanes } from '../types';

let planIdCounter = 1;

export default class Plan {
  planId: number;
  nombrePlan: string;
  precioPorNoche: number;
  fechaCreacion: string;
  sucursalId: number;

  // Constructor que recibe los parámetros directamente
  constructor(nombrePlan: string | TiposPlanes, precioPorNoche: number, sucursalId: number, fechaCreacion?: string);
  // Constructor que recibe un objeto que respeta la interface
  constructor(plan: Omit<IPlan, 'planId'>);
  // Implementación del constructor
  constructor(planOrNombre: Omit<IPlan, 'planId'> | string | TiposPlanes, precioPorNoche?: number, sucursalId?: number, fechaCreacion?: string) {
    this.planId = planIdCounter++;

    if (typeof planOrNombre === 'string') {
      this.nombrePlan = planOrNombre;
      this.precioPorNoche = precioPorNoche!;
      this.sucursalId = sucursalId!;
      this.fechaCreacion = fechaCreacion || new Date().toISOString();
    } else {
      this.nombrePlan = planOrNombre.nombrePlan;
      this.precioPorNoche = planOrNombre.precioPorNoche;
      this.sucursalId = planOrNombre.sucursalId;
      this.fechaCreacion = planOrNombre.fechaCreacion || new Date().toISOString();
    }
  }

  // Método público para obtener el ID del plan
  getId(): number {
    return this.planId;
  }

  // Método que genera el SQL para insertar el plan en la base de datos
  toSQL(): string {
    return `
      INSERT INTO planes
        (plan_id, nombre_plan, precio_por_noche, fecha_creacion, sucursal_id)
        VALUES
        (${this.planId}, '${this.nombrePlan}', ${this.precioPorNoche}, '${this.fechaCreacion}', ${this.sucursalId});
    `;
  }
}
