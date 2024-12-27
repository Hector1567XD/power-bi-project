import Persona from './Persona';

let huespedIdCounter = 1;

export default class Huesped {
  huespedId: number;
  personaId: number;
  private persona: Persona;

  // Constructor que recibe una persona existente
  constructor(persona: Persona);
  // Constructor que recibe los parámetros de manera individual
  constructor(cedula: string, nombre: string, fechaNacimiento: string, genero: string, fechaCreacion?: string);
  // Implementación del constructor
  constructor(personaOrCedula: Persona | string, nombre?: string, fechaNacimiento?: string, genero?: string, fechaCreacion?: string) {
    this.huespedId = huespedIdCounter++;
    
    if (personaOrCedula instanceof Persona) {
      this.persona = personaOrCedula;
      this.personaId = this.persona.getId();
    } else {
      // Si se pasan los parámetros individuales, crea una nueva instancia de Persona
      this.persona = new Persona(personaOrCedula, nombre!, fechaNacimiento!, genero!, fechaCreacion);
      this.personaId = this.persona.getId();
    }
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
}
