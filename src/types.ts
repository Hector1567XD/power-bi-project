export interface IPais {
  paisesId: number;
  continente: Continentes;
  nombre: string;
  fechaCreacion: string; // TIMESTAMPTZ se puede representar como string
}

// Enum para los continentes
export enum Continentes {
  Africa = 'Africa',
  Asia = 'Asia',
  Europa = 'Europa',
  AmericaDelNorte = 'America del Norte',
  AmericaDelSur = 'America del Sur',
  Oceanía = 'Oceanía',
  Antartida = 'Antartida'
}

export enum TiposPlanes {
  TodoIncluido = 'Todo Incluido',
  SoloDesayuno = 'Solo Desayuno',
  NocheDeBodas = 'Noche de Bodas',
  SoloHospedaje = 'Solo Hospedaje',
  FullDay = 'Full Day'
}

export enum TiposServicios {
  Gimnasio = 'Gimnasio',
  Spa = 'Spa',
  Restaurante = 'Restaurante',
  Casino = 'Casino',
  Lavanderia = 'Lavandería',
  Peluqueria = 'Peluquería',
  Discoteca = 'Discoteca',
  ZonaGamer = 'Zona Gamer'
}

export enum TiposHabitaciones {
  Suite = 'Suite',
  Estándar = 'Estándar',
  Doble = 'Doble',
  Triple = 'Triple',
  Familiar = 'Familiar',
  // Agrega más tipos de habitaciones según sea necesario
}

export interface IPersona {
  personaId: number;
  cedula: string;
  nombre: string;
  fechaNacimiento: string; // DATE se puede representar como string
  genero: string;
  fechaCreacion: string; // TIMESTAMPTZ se puede representar como string
}

export interface IEmpleado {
  empleadoId: number;
  personaId: number;
}

export interface IHuesped {
  huespedId: number;
  personaId: number;
}

export interface ISucursal {
  sucursalId: number;
  nombre: string;
  paisesId: number; // No puede ser null
  fechaCreacion: string; // TIMESTAMPTZ se puede representar como string
}

export interface IPlan {
  planId: number;
  nombrePlan: string; // Cambiado a nombre_plan
  precioPorNoche: number;
  fechaCreacion: string; // TIMESTAMPTZ se puede representar como string
  sucursalId: number;
}

export interface IServicio {
  servicioId: number;
  nombreServicio: string; // Cambiado a nombre_servicio
  precio: number;
  sucursalId: number;
  fechaCreacion: string; // TIMESTAMPTZ se puede representar como string
}

export interface IHabitacion {
  habitacionId: number;
  tipoHabitacion: TiposHabitaciones;
  numeroMaxHuespedes: number;
  sucursalId: number;
}

export interface IReserva {
  reservaId: number;
  numeroHuespedes: number;
  precioDePlan: number;
  cantidadNoches: number;
  fechaInicio: string; // DATE se puede representar como string
  fechaFinal: string; // DATE se puede representar como string
  fechaCreacion: string; // TIMESTAMPTZ se puede representar como string
  habitacionId: number;
  huespedId: number;
  planId: number;
  servicioId: number;
}
