import { IPersona } from '../types';

let personaIdCounter = 1;

export default class Persona {
  personaId: number;
  cedula: string;
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  fechaCreacion: string;

  // Constructor que recibe un objeto que respeta la interface
  constructor(persona: Omit<IPersona, 'personaId'>);
  // Constructor que recibe los parámetros de manera individual
  constructor(cedula: string, nombre: string, fechaNacimiento: string, genero: string, fechaCreacion?: string);
  // Implementación del constructor
  constructor(personaOrCedula: Omit<IPersona, 'personaId'> | string, nombre?: string, fechaNacimiento?: string, genero?: string, fechaCreacion?: string) {
    this.personaId = personaIdCounter++;
    if (typeof personaOrCedula === 'string') {
      this.cedula = personaOrCedula;
      this.nombre = nombre!;
      this.fechaNacimiento = fechaNacimiento!;
      this.genero = genero!;
      this.fechaCreacion = fechaCreacion || new Date().toISOString();
    } else {
      this.cedula = personaOrCedula.cedula;
      this.nombre = personaOrCedula.nombre;
      this.fechaNacimiento = personaOrCedula.fechaNacimiento;
      this.genero = personaOrCedula.genero;
      this.fechaCreacion = personaOrCedula.fechaCreacion || new Date().toISOString();
    }
  }

  // Método público para obtener el ID
  getId(): number {
    return this.personaId;
  }

  toSQL(): string {
    return `
        INSERT INTO persona
          (persona_id, cedula, nombre, fechaNacimiento, genero, fechaCreacion)
          VALUES
          (${this.personaId}, '${this.cedula}', '${this.nombre}', '${this.fechaNacimiento}', '${this.genero}', '${this.fechaCreacion}');
        `;
  }
}
