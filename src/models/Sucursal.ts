import { CreationCB, ISucursal, POSIBLE_HABITATIONS, POSIBLE_PLANNES, POSIBLE_SERVICES } from "../types";
import { faker } from '@faker-js/faker';  // Importar faker
import Pais from "./Pais";
import { TemporadaType as TP } from "../types";
import Plan from "./Plan";
import Servicio from "./Servicio";
import { choose, chooseMultiple, irandom_range, varyWithinPercentage } from '../helpers';
import Huesped from "./Huesped";
import Habitacion from "./Habitacion";

// Variable de módulo para manejar el contador de IDs
let currentSucursalId = 1;

const VARIANZA_PLAN = 20;
const VARIANZA_SERVICIO = 10;

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

  constructor(nombre: string, pais: Pais, fechaCreacion: string, planes?: Plan[], servicios?: Servicio[], cb?: CreationCB<Sucursal>) {
    // Asignamos el ID de sucursal desde el contador de módulo y lo incrementamos
    this.sucursalId = currentSucursalId++;
    this.nombre = nombre;


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
      INSERT INTO sucursal (sucursal_id, nombre, paises_id, fecha_creacion)
      VALUES (${this.sucursalId}, '${this.nombre}', ${this.paisesId}, '${this.fechaCreacion}');
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

  // Método estático para crear una sucursal con datos aleatorios utilizando faker
  static createRandom(pais: Pais, cb?: CreationCB<Sucursal>): Sucursal {
    const nombre = faker.company.name();
    const fechaCreacion = new Date().toISOString();  // Usamos la fecha actual en formato ISO para TIMESTAMPTZ
    const sucursal = new Sucursal(nombre, pais, fechaCreacion);

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

    const habsNumber = irandom_range(20, 50);
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
}
