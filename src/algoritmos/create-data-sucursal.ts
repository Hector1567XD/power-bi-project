
import { faker } from '@faker-js/faker';  // Importar faker
import Huesped from "../models/Huesped";
import Reserva from "../models/Reserva";
import Sucursal from "../models/Sucursal";
import { TemporadaType } from '../types';

export default function createDataSucursal(sucursal: Sucursal): (Huesped | Reserva)[] {
    const temporadas: TemporadaType[] = sucursal.getTemporadas();

  //return temporadas.map();
  
  return [];
}


/*
export enum TemporadaType {
  A = 'Alta',
  B = 'Baja',
  N = 'Ninguna'
}
*/