import { CreationCB, ISucursal, POSIBLE_HABITATIONS, POSIBLE_PLANNES, POSIBLE_SERVICES } from "../types";
import { faker } from '@faker-js/faker';  // Importar faker
import Pais from "./Pais";
import { TemporadaType as TP } from "../types";
import Plan from "./Plan";
import Servicio from "./Servicio";
import { choose, chooseMultiple, irandom_range, varyWithinPercentage, sanitizeString } from '../helpers';
import Huesped from "./Huesped";
import Habitacion from "./Habitacion";
import Reserva from "./Reserva";
import dayjs from "dayjs";
import ReservaServicio from './ReservaServicio';
import dotenv from 'dotenv';
dotenv.config();

// Variable de módulo para manejar el contador de IDs
let currentSucursalId = 1;

const VARIANZA_PLAN = +(process.env.VARIANZA_PLAN || '');
const VARIANZA_SERVICIO = +(process.env.VARIANZA_SERVICIO || '');

const MODO_POQUITO = !!process.env.MODO_POQUITO;

const HABS_NUMBER_POQUITO_MIN = +(process.env.HABS_NUMBER_POQUITO_MIN || '');
const HABS_NUMBER_POQUITO_MAX = +(process.env.HABS_NUMBER_POQUITO_MAX || '');
const HABS_NUMBER_NORMAL_MIN = +(process.env.HABS_NUMBER_NORMAL_MIN || '');
const HABS_NUMBER_NORMAL_MAX = +(process.env.HABS_NUMBER_NORMAL_MAX || '');

export default class Sucursal implements ISucursal {
  sucursalId: number;
  nombre: string;
  paisesId: number;
  fechaCreacion: string;
  pais: Pais;
  planes: Plan[] = [];
  servicios: Servicio[] = [];
  clientsUniques: Huesped[] = [];
  habitations: Habitacion[] = [];
  reservasActivas: Reserva[] = [];
  historicoReservas: Reserva[] = [];
  clientsUniquesAvailables: Huesped[] = [];
  ciudad: string = '';

  constructor(nombre: string, pais: Pais, fechaCreacion: string, planes?: Plan[], servicios?: Servicio[], ciudad?: string, cb?: CreationCB<Sucursal>) {
    // Asignamos el ID de sucursal desde el contador de módulo y lo incrementamos
    this.sucursalId = currentSucursalId++;
    this.nombre = sanitizeString(nombre);


    this.paisesId = pais.getId();  // Si es número, asignamos directamente
    this.pais = pais;

    this.fechaCreacion = fechaCreacion;

    // Si se pasaron planes y servicios, los asignamos
    if (planes) {
      this.planes = planes;
    }
    if (servicios) {
      this.servicios = servicios;
    }

    if (ciudad) {
      this.ciudad = ciudad;
    }

    cb?.(this);
  }

  addPlanes(planes: Plan[]): void {
    this.planes = [...this.planes, ...planes];
  }

  addServicios(servicios: Servicio[]): void {
    this.servicios = [...this.servicios, ...servicios];
  }

  addHabitacions(habitacions: Habitacion[]): void {
    this.habitations = [...this.habitations, ...habitacions];
  }

  // Método para generar el SQL de inserción de la sucursal
  toSQL(): string {
    let sql = `
      INSERT INTO sucursal (sucursal_id, nombre, paises_id, fecha_creacion, ciudad)
      VALUES (${this.sucursalId}, '${this.nombre}', ${this.paisesId}, '${this.fechaCreacion}', '${this.ciudad}');
    `;

    // Generamos el SQL para los planes asociados a la sucursal utilizando el método toSQL de Plan
    this.planes.forEach(plan => {
      sql += plan.toSQL(); // Llamamos al método toSQL de cada plan
    });

    // Generamos el SQL para los servicios asociados a la sucursal utilizando el método toSQL de Servicio
    this.servicios.forEach(servicio => {
      sql += servicio.toSQL(); // Llamamos al método toSQL de cada servicio
    });

    this.habitations.forEach(habitation => {
      sql += habitation.toSQL();
    });

    return sql;
  }

  // Método para obtener las temporadas
  getTemporadas(): TP[] {
      // Respetando la ley de demeter
    return this.pais.getTemporadas();
  }
    
  getPlanes(): Plan[] {
    return this.planes;
  }

  getServicios(): Servicio[] {
    return this.servicios;
  }

  getHabitations(): Habitacion[] {
    return this.habitations;
  }

  getId(): number {
    return this.sucursalId;
  }

  addHuesped(huesped: Huesped) {
    this.clientsUniques.push(huesped);
    // Agrega por primera ves al cliente al arreglo de disponibilidad
    this.clientsUniquesAvailables.push(huesped);

    return huesped;
  }

  recoverHuesped(): Huesped | null {
    if (!this.clientsUniquesAvailables.length) return null;

    return choose(this.clientsUniquesAvailables);
  }

  getHabitacionLibre(): Habitacion | null {
    return this.habitations.find(hab => !hab.isOcupada()) || null;
  }

  existeAlgunaHabitacionLibre(): boolean {
    return this.habitations.some(hab => !hab.isOcupada());
  }

  isFull(): boolean {
    return !this.existeAlgunaHabitacionLibre();
  }

  liberarClientsYHabitaciones(fecha: string) {
    const fechaComparar = dayjs(fecha); // Convertir la fecha de cadena a dayjs

    const reservasALiberar = this.reservasActivas.filter(reserva => dayjs(reserva.fechaFinal).isBefore(fechaComparar));
    const reservasALiberarIds = reservasALiberar.map(reserva => reserva.reservaId);
    const huespedesIdsALiberar = reservasALiberar.map(reserva => reserva.huespedId);
    const habitacionesIdsALiberar = reservasALiberar.map(reserva => reserva.habitacionId);

    const huespedesToLiberate = this.clientsUniques.filter(huesped => huespedesIdsALiberar.includes(huesped.getId()));
    const habitacionesToLiberate = this.habitations.filter(hab => habitacionesIdsALiberar.includes(hab.getId()));

    huespedesToLiberate.forEach(huesped => {
      huesped.desocuparHuesped();
      // Vuelve a agregar al cliente al arreglo de disponibles
      this.clientsUniquesAvailables.push(huesped);
    });
    habitacionesToLiberate.forEach(hab => {
      hab.desocuparHabitacion();
    });

    // Filtrar las reservas que tienen una fechaFinal mayor o igual a la fecha de comparación
    this.reservasActivas = this.reservasActivas.filter(reserva => !reservasALiberarIds.includes(reserva.reservaId));
  }

  promoverComprasDeServicios(fecha: string): ReservaServicio[] {
    const serviciosComprados: ReservaServicio[] = [];
    const reservasActivas = this.reservasActivas;

    reservasActivas.map((reserva) => {
      const cantidadDePermisosATomar = this.determinarCantidadDeServicios(reserva);
      for (let i = 0; i < cantidadDePermisosATomar; i++) {

        if (!this.servicios.length) {
          console.warn('No hay servicios disponibles en ', this.nombre);
          break;
        }

        const servicio = choose(this.servicios);
        const newServicioReserva = new ReservaServicio(reserva, servicio, fecha);
        serviciosComprados.push(newServicioReserva);
      }
    });

    return serviciosComprados;
  }

  private determinarCantidadDeServicios(reserva: Reserva) {
    // servicios a contratar el dia de hoy
    let servicesQuantity = 0;
    
    // 40% de probabilidades de que opte por contratar un servicio
    const probabilidadBase = 0.4;
    let probabilidaReal = probabilidadBase;
    // Si viene acompañado de una sola persona, aumenta un 20% la probabilidad
    if (reserva.numeroHuespedes == 2) {
      probabilidaReal = probabilidadBase + 0.2;
    } else if (reserva.numeroHuespedes >= 2 && reserva.numeroHuespedes <= 4 && reserva.habitacion.numeroMaxHuespedes <= 5) {
      // Si viene acompañado de entre 2 a 3 personas pero la capacidad de la habitacion es menor de 5, aumenta un 30% la probabilidad
      probabilidaReal = probabilidadBase + 0.25;
    } else if (reserva.numeroHuespedes > 5) {
      // Aumenta 20% + hasta 20% dividiendo NumeroHuespedes/numeroMaximoHuespedes
      probabilidaReal = probabilidadBase + 0.2 + (reserva.numeroHuespedes / reserva.habitacion.numeroMaxHuespedes) * 0.2;
    } else {
      // Nose
      probabilidaReal = 0.7;
    }

    if (Math.random() < 0.5) {
      if (reserva.numeroHuespedes === 1) {
        // 0.2 % de probabilidades de contratar 2 servicios
        servicesQuantity = choose([1, 1, 1, 1, 2]);
      } else if (reserva.numeroHuespedes === 2) {
        // 0.4 % de probabilidades de contratar 2 servicios
        servicesQuantity = choose([1, 1, 1, 2, 2]);
      } else if (reserva.numeroHuespedes >= 3) {
        servicesQuantity = irandom_range(1, 3);
      } else {
        servicesQuantity = irandom_range(1, 4);
      }
    }
    
    return servicesQuantity;
  }

  attempNewReserva(huesped: Huesped, fechaHoy: string): Reserva | null {
    const hab = this.getHabitacionLibre();
    const plan = choose(this.planes);

    if (!hab || !plan) {
      return null;
    }

    if (huesped.isOcupado()) {
      return null;
    }

    if (hab.isOcupada()) {
      return null;
    }

    // Agrega la nueva reserva
    const numeroHuespedes = irandom_range(1, hab.numeroMaxHuespedes);

    const reserva = new Reserva(
      numeroHuespedes,
      plan.precioPorNoche,
      irandom_range(1, 7),
      fechaHoy,
      hab,
      huesped,
      plan
    );

    // Elimina al cliente del arreglo de disponibles
    const index = this.clientsUniquesAvailables.findIndex(client => client.getId() === huesped.getId());
    if (index !== -1) {
      this.clientsUniquesAvailables.splice(index, 1);
    }

    this.reservasActivas.push(reserva);
    this.historicoReservas.push(reserva);

    return reserva;
  }

  // Método estático para crear una sucursal con datos aleatorios utilizando faker
  static createRandom(pais: Pais, ciudad: string, cb?: CreationCB<Sucursal>): Sucursal {
    const nombre = faker.company.name();
    const fechaCreacion = new Date().toISOString();  // Usamos la fecha actual en formato ISO para TIMESTAMPTZ
    const sucursal = new Sucursal(nombre, pais, fechaCreacion, undefined, undefined, ciudad);

    // Generamos planes y servicios aleatorios
    const planesToCreate = chooseMultiple(POSIBLE_PLANNES);
    const planes = planesToCreate.map((planToCreate) => {
      return new Plan(
        planToCreate.plan,
        varyWithinPercentage(planToCreate.value, VARIANZA_PLAN),
        sucursal.getId(),
        undefined
      )
    });

    const servicesToCreate = chooseMultiple(POSIBLE_SERVICES);
    const services = servicesToCreate.map((servicetoCreate) => {
      return new Servicio(
        servicetoCreate.servicio,
        varyWithinPercentage(servicetoCreate.value, VARIANZA_SERVICIO),
        sucursal.getId(),
        undefined
      )
    });

    const habsNumber = this.getRandomHabsNumber();

    const habitaciones: Habitacion[] = [];
    for (let i = 0; i < habsNumber; i++) {
      const tipo = choose(POSIBLE_HABITATIONS);  // Selección aleatoria de tipo de habitación

      habitaciones.push(new Habitacion(
        tipo,
        irandom_range(1, 6),
        sucursal.getId()
      ));
    }

    sucursal.addPlanes(planes);
    sucursal.addServicios(services);
    sucursal.addHabitacions(habitaciones);

    cb?.(sucursal);

    return sucursal;
  }

  static getRandomHabsNumber(): number {
    if (MODO_POQUITO) {
      return irandom_range(HABS_NUMBER_POQUITO_MIN, HABS_NUMBER_POQUITO_MAX);
    }

    return irandom_range(HABS_NUMBER_NORMAL_MIN, HABS_NUMBER_NORMAL_MAX);
  }
}
