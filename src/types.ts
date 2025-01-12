export interface IPais {
  paisesId: number;
  continente: Continentes;
  nombre: string;
  fechaCreacion: string; // TIMESTAMPTZ se puede representar como string
  temporadaTypes?: TemporadaType[];
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

export const CONTINENTES: Continentes[] = [
  Continentes.Africa,
  Continentes.Asia,
  Continentes.Europa,
  Continentes.AmericaDelNorte,
  Continentes.AmericaDelSur,
  Continentes.Oceanía,
  Continentes.Antartida
];

export const CONTINENTES_FILE_NAME_PATH: Record<Continentes, string> = {
  [Continentes.Africa]: 'africa',
  [Continentes.Asia]: 'asia',
  [Continentes.Europa]: 'europa',
  [Continentes.AmericaDelNorte]: 'america-del-norte',
  [Continentes.AmericaDelSur]: 'america-del-sur',
  [Continentes.Oceanía]: 'oceania',
  [Continentes.Antartida]: 'antartida'
}

export enum TiposPlanes {
  TodoIncluido = 'Todo Incluido',
  SoloDesayuno = 'Solo Desayuno',
  NocheDeBodas = 'Noche de Bodas',
  SoloHospedaje = 'Solo Hospedaje',
  FullDay = 'Full Day',
  SoloAlmuerzo = 'Solo Almuerzo',
  MediaPension = 'Media Pensión',
  TodoIncluidoPlus = 'Todo Incluido Plus',
  EscapadaRomantica = 'Escapada Romántica',
  PlanFamiliar = 'Plan Familiar'
}

interface PossiblePlan {
  plan: TiposPlanes;
  value: number;
}

export const POSIBLE_PLANNES: PossiblePlan[] = [
  { plan: TiposPlanes.TodoIncluido, value: 150 },
  { plan: TiposPlanes.SoloDesayuno, value: 50 },
  { plan: TiposPlanes.NocheDeBodas, value: 250 },
  { plan: TiposPlanes.SoloHospedaje, value: 100 },
  { plan: TiposPlanes.FullDay, value: 180 },
  { plan: TiposPlanes.SoloAlmuerzo, value: 60 },
  { plan: TiposPlanes.MediaPension, value: 120 },
  { plan: TiposPlanes.TodoIncluidoPlus, value: 200 },
  { plan: TiposPlanes.EscapadaRomantica, value: 220 },
  { plan: TiposPlanes.PlanFamiliar, value: 300 }
];

export enum TiposHabitaciones {
  Suite = 'Suite',
  Estándar = 'Estándar',
  Doble = 'Doble',
  Triple = 'Triple',
  Familiar = 'Familiar',
  // Agrega más tipos de habitaciones según sea necesario
}

export const POSIBLE_HABITATIONS = [
  TiposHabitaciones.Suite,
  TiposHabitaciones.Doble,
  TiposHabitaciones.Triple,
  TiposHabitaciones.Familiar,
  TiposHabitaciones.Estándar
];

export enum TiposServicios {
  Gimnasio = 'Gimnasio',
  Spa = 'Spa',
  Restaurante = 'Restaurante',
  Casino = 'Casino',
  Lavanderia = 'Lavandería',
  Peluqueria = 'Peluquería',
  Discoteca = 'Discoteca',
  ZonaGamer = 'Zona Gamer',
  Piscina = 'Piscina',
  ServicioDeHabitacion = 'Servicio de Habitación',
  ActividadesDeAventura = 'Actividades de Aventura',
  SalaDeConferencias = 'Sala de Conferencias',
  AlquilerDeVehiculos = 'Alquiler de Vehículos',
  ServicioDeCuidadoInfantil = 'Servicio de Cuidado Infantil',
  TiendaDeSouvenirs = 'Tienda de Souvenirs',
  RestauranteGourmet = 'Restaurante Gourmet',
  TransporteAeropuerto = 'Transporte al Aeropuerto',
  Estacionamiento = 'Estacionamiento',
  WifiGratis = 'Wifi Gratis',
}

interface PossibleService {
  servicio: TiposServicios;
  value: number;
}

export const POSIBLE_SERVICES: PossibleService[] = [
  { servicio: TiposServicios.Gimnasio, value: 20 },
  { servicio: TiposServicios.Spa, value: 50 },
  { servicio: TiposServicios.Restaurante, value: 30 },
  { servicio: TiposServicios.Casino, value: 40 },
  { servicio: TiposServicios.Lavanderia, value: 15 },
  { servicio: TiposServicios.Peluqueria, value: 25 },
  { servicio: TiposServicios.Discoteca, value: 35 },
  { servicio: TiposServicios.ZonaGamer, value: 20 },
  { servicio: TiposServicios.Piscina, value: 15 },
  { servicio: TiposServicios.ServicioDeHabitacion, value: 30 },
  { servicio: TiposServicios.ActividadesDeAventura, value: 100 },
  { servicio: TiposServicios.SalaDeConferencias, value: 200 },
  { servicio: TiposServicios.AlquilerDeVehiculos, value: 75 },
  { servicio: TiposServicios.ServicioDeCuidadoInfantil, value: 40 },
  { servicio: TiposServicios.TiendaDeSouvenirs, value: 10 },
  { servicio: TiposServicios.RestauranteGourmet, value: 60 },
  { servicio: TiposServicios.TransporteAeropuerto, value: 50 },
  { servicio: TiposServicios.Estacionamiento, value: 20 },
  { servicio: TiposServicios.WifiGratis, value: 0 } // Puede ser gratuito en algunos casos
];

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
  ciudad: string;
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
}

export type CreationCB<T> = (entity: T) => void;

export enum TemporadaType {
  A = 'Alta',
  B = 'Baja',
  N = 'Ninguna'
}

export interface IReservaServicio {
  reservaServicioId: number;  // ID único para la relación
  reservaId: number;
  servicioId: number;
  price: number;
  fechaCreacion: string; // TIMESTAMPTZ se puede representar como string
}
