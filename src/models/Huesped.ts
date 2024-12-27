import { faker } from '@faker-js/faker';
import Persona from './Persona';
import { IPersona } from '../types';
import { choose, irandom_range } from '../helpers';
import Reserva from './Reserva';

let huespedIdCounter = 1; // Comienza en 1
let cedulaCounter = 10000000; // La cédula comienza en 10.000.000

export default class Huesped {
  huespedId: number;
  personaId: number;
  private persona: Persona;
  ocupado: Reserva | null = null;

  // Constructor que recibe una persona existente
  constructor(persona: Persona);
  // Constructor que recibe los parámetros de manera individual
  constructor(cedula: string, nombre: string, fechaNacimiento: string, genero: string, fechaCreacion?: string);
  // Implementación del constructor
  constructor(personaOrCedula: Persona | string, nombre?: string, fechaNacimiento?: string, genero?: string, fechaCreacion?: string) {
    this.huespedId = huespedIdCounter++; // Incrementa el ID del huésped para evitar duplicados
    
    if (personaOrCedula instanceof Persona) {
      this.persona = personaOrCedula;
      this.personaId = this.persona.getId();
    } else {
      // Si se pasan los parámetros individuales, crea una nueva instancia de Persona
      this.persona = new Persona(personaOrCedula, nombre!, fechaNacimiento!, genero!, fechaCreacion);
      this.personaId = this.persona.getId();
    }
  }

  ocuparHuesped(reserva: Reserva): void {
    this.ocupado = reserva;
  }

  desocuparHuesped(): void {
    this.ocupado = null;
  }

  isOcupado(): boolean {
    return this.ocupado !== null;
  }

  // Método público para obtener el ID del huesped
  getId(): number {
    return this.huespedId;
  }

  // Getter para obtener la instancia de Persona
  getPersona(): Persona {
    return this.persona;
  }

  // Método que genera el SQL tanto para el huesped como para la persona
  toSQL(): string {
    const personaSQL = this.persona.toSQL(); // Obtiene el SQL de la persona
    return `
      ${personaSQL}
      INSERT INTO huesped
        (huesped_id, persona_id)
        VALUES
        (${this.huespedId}, ${this.personaId});
      `;
  }

  // Método estático para crear un huésped con datos aleatorios usando faker
  static createRandom(): Huesped {
    const cedula = (cedulaCounter++).toString().padStart(9, '0').replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3'); // Crear la cédula con formato 'xx.xxx.xxx'
    const nombre = faker.person.firstName();

    // Calcular una fecha de nacimiento aleatoria para una persona entre 18 y 65 años
    const edadMinima = 18;
    const edadMaxima = 65;
    const edad = faker.number.int({ min: edadMinima, max: edadMaxima });
    const fechaNacimiento = faker.date.past({ years: edad }).toISOString().split('T')[0]; // Generar fecha de nacimiento con base en la edad calculada

    const genero = faker.person.gender();
    //const genero = choose(['Masculino', 'Femenino', 'Otro', 'Helicoptero', 'Luis Vasquez']); // Generar un género aleatorio
    const fechaCreacion = faker.date.past({ years: irandom_range(1,2) }).toISOString().split('T')[0]; // Fecha de creación aleatoria

    const personaInstance = new Persona(cedula, nombre, fechaNacimiento, genero, fechaCreacion); // Crea una instancia de persona con los datos generados

    return new Huesped(personaInstance); // Crea un huésped con la persona generada
  }
}
