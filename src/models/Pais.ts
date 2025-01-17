import { Continentes, CreationCB, IPais, TemporadaType as TP } from '../types';

let paisIdCounter = 1;

export default class Pais {
  paisesId: number;
  continente: Continentes; // Ahora el tipo es Continentes
  nombre: string;
  fechaCreacion: string;
  temporadaTypes: TP[] = [TP.N,TP.N,TP.N,TP.N,TP.N,TP.N,TP.N,TP.N,TP.N,TP.N,TP.N,TP.N];

  // Constructor que recibe un objeto que respeta la interface
  constructor(pais: Omit<IPais, 'paisId'>);
  // Constructor que recibe los parámetros de manera individual
  constructor(continente: Continentes, nombre: string, fechaCreacion?: string, cb?: CreationCB<Pais>, temporadaTypes?: TP[]);
  // Implementación del constructor
  constructor(paisOrContinente: Omit<IPais, 'paisId'> | Continentes, nombre?: string, fechaCreacion?: string, cb?: CreationCB<Pais>, temporadaTypes?: TP[]) {
    this.paisesId = paisIdCounter++;

    if (typeof paisOrContinente === 'string') {
      this.continente = paisOrContinente as Continentes; // Se asegura de que el continente sea válido
      this.nombre = nombre!;
      this.fechaCreacion = fechaCreacion || new Date().toISOString();
      if (temporadaTypes) this.temporadaTypes = temporadaTypes;
    } else {
      this.continente = paisOrContinente.continente;
      this.nombre = paisOrContinente.nombre;
      this.fechaCreacion = paisOrContinente.fechaCreacion || new Date().toISOString();
      if (paisOrContinente.temporadaTypes) this.temporadaTypes = paisOrContinente.temporadaTypes;
    }

    cb?.(this)
  }

  // Método público para obtener el ID
  getId(): number {
    return this.paisesId;
  }

  // Método para obtener las temporadas
  getTemporadas(): TP[] {
    return this.temporadaTypes;
  }

  toSQL(): string {
    return `
      INSERT INTO paises
        (paises_id, continente, nombre, fecha_creacion)
        VALUES
        (${this.paisesId}, '${this.continente}', '${this.nombre}', '${this.fechaCreacion}');
    `;
  }
}