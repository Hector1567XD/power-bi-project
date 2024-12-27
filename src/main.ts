
// Implementación del generador de SQL
import { Pais as PaisI, Persona as PersonaI, Empleado as EmpleadoI, Huesped as HuespedI, Sucursal as SucursalI, Plan as PlanI, Servicio as ServicioI, Habitacion as HabitacionI, Reserva as ReservaI } from './types';

class Pais implements PaisI {
  paisesId: number;
  fechaCreacion: string;

  constructor(public continente: string, public nombre: string) {
    this.paisesId = Date.now();
    this.fechaCreacion = new Date().toISOString();
  }

  toSQL(): string {
    return `INSERT INTO paises (paises_id, continente, nombre, fecha_creacion) VALUES (${this.paisesId}, '${this.continente}', '${this.nombre}', '${this.fechaCreacion}');`;
  }
}

class Persona implements PersonaI {
  personaId: number;

  constructor(public cedula: string, public nombre: string, public edad: number) {
    this.personaId = Date.now();
  }

  toSQL(): string {
    return `INSERT INTO persona (persona_id, cedula, nombre, edad) VALUES (${this.personaId}, '${this.cedula}', '${this.nombre}', ${this.edad});`;
  }
}

class Empleado implements EmpleadoI {
  empleadoId: number;

  constructor(public personaId: number) {
    this.empleadoId = Date.now();
  }

  toSQL(): string {
    return `INSERT INTO empleado (empleado_id, persona_id) VALUES (${this.empleadoId}, ${this.personaId});`;
  }
}

class Huesped implements HuespedI {
  huespedId: number;

  constructor(public personaId: number) {
    this.huespedId = Date.now();
  }

  toSQL(): string {
    return `INSERT INTO huesped (huesped_id, persona_id) VALUES (${this.huespedId}, ${this.personaId});`;
  }
}

class Sucursal implements SucursalI {
  sucursalId: number;
  fechaCreacion: string;

  constructor(public nombre: string, public paisesId: number) {
    this.sucursalId = Date.now();
    this.fechaCreacion = new Date().toISOString();
  }

  toSQL(): string {
    return `INSERT INTO sucursal (sucursal_id, nombre, paises_id, fecha_creacion) VALUES (${this.sucursalId}, '${this.nombre}', ${this.paisesId}, '${this.fechaCreacion}');`;
  }
}

class Plan implements PlanI {
  planId: number;
  fechaCreacion: string;

  constructor(public tipoDePlan: string, public precioPorNoche: number, public sucursalId: number) {
    this.planId = Date.now();
    this.fechaCreacion = new Date().toISOString();
  }

  toSQL(): string {
    return `INSERT INTO planes (plan_id, tipoDePlan, precioPorNoche, sucursal_id, fecha_creacion) VALUES (${this.planId}, '${this.tipoDePlan}', ${this.precioPorNoche}, ${this.sucursalId}, '${this.fechaCreacion}');`;
  }
}

class Servicio implements ServicioI {
  servicioId: number;
  fechaCreacion: string;

  constructor(public tipoDeServicio: string, public precio: number, public sucursalId: number) {
    this.servicioId = Date.now();
    this.fechaCreacion = new Date().toISOString();
  }

  toSQL(): string {
    return `INSERT INTO servicio (servicio_id, tipoDeServicio, precio, sucursal_id, fecha_creacion) VALUES (${this.servicioId}, '${this.tipoDeServicio}', ${this.precio}, ${this.sucursalId}, '${this.fechaCreacion}');`;
  }
}

class Habitacion implements HabitacionI {
  habitacionId: number;

  constructor(public tipoDeHabitacion: string, public numeroMaxHuespedes: number, public sucursalId: number) {
    this.habitacionId = Date.now();
  }

  toSQL(): string {
    return `INSERT INTO habitacion (habitacion_id, tipoDeHabitacion, numeroMaxHuespedes, sucursal_id) VALUES (${this.habitacionId}, '${this.tipoDeHabitacion}', ${this.numeroMaxHuespedes}, ${this.sucursalId});`;
  }
}

class Reserva implements ReservaI {
  reservaId: number;
  fechaCreacion: string;
  private persona?: Persona;
  private servicios: Servicio[] = [];

  constructor(
    public numeroHuespedes: number,
    public precioDePlan: number,
    public cantidadNoches: number,
    public edadActualDelTitular: number,
    public fechaInicio: string,
    public fechaFinal: string,
    public habitacionId: number,
    public huespedId: number,
    public planId: number,
    public servicioId: number
  ) {
    this.reservaId = Date.now();
    this.fechaCreacion = new Date().toISOString();
  }

  setPersona(persona: Persona): void {
    this.persona = persona;
  }

  addService(servicio: Servicio): void {
    this.servicios.push(servicio);
  }

  toSQL(): string {
    return `INSERT INTO reserva (reserva_id, numeroHuespedes, precioDePlan, cantidadNoches, edadActualDelTitular, fechaInicio, fechaFinal, habitacion_id, huesped_id, plan_id, servicio_id, fecha_creacion) VALUES (${this.reservaId}, ${this.numeroHuespedes}, ${this.precioDePlan}, ${this.cantidadNoches}, ${this.edadActualDelTitular}, '${this.fechaInicio}', '${this.fechaFinal}', ${this.habitacionId}, ${this.huespedId}, ${this.planId}, ${this.servicioId}, '${this.fechaCreacion}');`;
  }
}

class Processor {
  run(entities: { toSQL: () => string }[]): string {
    return entities.map(entity => entity.toSQL()).join('\n');
  }
}

// Ejemplo de uso
const processor = new Processor();

const persona1 = new Persona('12345678', 'John Doe', 30);
const reserva1 = new Reserva(2, 150, 3, 30, '2024-12-27', '2024-12-30', 1, 2, 1, 1);
reserva1.setPersona(persona1);
reserva1.addService(new Servicio('Spa', 50, 1));

const sql = processor.run([
  new Pais('América', 'Venezuela'),
  new Pais('Europa', 'Francia'),
  persona1,
  new Empleado(1),
  new Huesped(2),
  new Sucursal('Hotel Caracas', 1),
  new Plan('Todo Incluido', 150, 1),
  new Servicio('Spa', 50, 1),
  new Habitacion('Suite', 2, 1),
  reserva1
]);

console.log(sql);