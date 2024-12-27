// Define los tipos para cada tabla en TypeScript

export interface Pais {
  paisesId: number;
  continente: string;
  nombre: string;
  fechaCreacion: string; // Usar ISO string para timestamps
}

export interface Persona {
  personaId: number;
  cedula: string;
  nombre: string;
  edad: number;
}

export interface Empleado {
  empleadoId: number;
  personaId: number;
}

export interface Huesped {
  huespedId: number;
  personaId: number;
}

export interface Sucursal {
  sucursalId: number;
  nombre: string;
  paisesId: number;
  fechaCreacion: string;
}

export interface Plan {
  planId: number;
  tipoDePlan: string;
  precioPorNoche: number;
  fechaCreacion: string;
  sucursalId: number;
}

export interface Servicio {
  servicioId: number;
  tipoDeServicio: string;
  precio: number;
  sucursalId: number;
  fechaCreacion: string;
}

export interface Habitacion {
  habitacionId: number;
  tipoDeHabitacion: string;
  numeroMaxHuespedes: number;
  sucursalId: number;
}

export interface Reserva {
  reservaId: number;
  numeroHuespedes: number;
  precioDePlan: number;
  cantidadNoches: number;
  edadActualDelTitular: number;
  fechaInicio: string; // Formato ISO para fechas
  fechaFinal: string; // Formato ISO para fechas
  fechaCreacion: string;
  habitacionId: number;
  huespedId: number;
  planId: number;
  servicioId: number;
}
