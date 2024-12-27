import { faker } from '@faker-js/faker';  // Importar faker
import Huesped from "../models/Huesped";
import Reserva from "../models/Reserva";
import Sucursal from "../models/Sucursal";
import { TemporadaType } from '../types';
import ReservaServicio from '../models/ReservaServicio';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const MODO_POQUITO = !!process.env.MODO_POQUITO;

// Función para decidir si se crea un nuevo huésped o se recupera uno existente
function isRecovingChoose(probability: number = 0.25) {
  return Math.random() < probability;
}

// Función para obtener la cantidad de días en un mes específico
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Función principal para generar los datos
export default function createDataSucursal(sucursal: Sucursal): (Huesped | Reserva | ReservaServicio)[] {
  /*console.log('====================');
  console.log('Generando datos para la sucursal:', sucursal.nombre);
  console.log('====================');*/

  const data: (Huesped | Reserva | ReservaServicio)[] = [];
  const temporadas: TemporadaType[] = sucursal.getTemporadas();

  // Iterar sobre los tres años
  for (let year = +(process.env.MIN_YEAR || ''); year <= +(process.env.MAX_YEAR || ''); year++) {
    // Iterar sobre las temporadas del año
    let monthIndex = 0;
    for (const temporada of temporadas) {
      // Obtener el mes correspondiente al índice de la temporada
      const month = monthIndex; // El índice de la temporada es el mes (0-11)

      // Obtener la cantidad de días en la temporada actual
      const daysInSeason = getDaysInMonth(year, month);

      // Recorrer cada día de la temporada
      for (let day = 1; day <= daysInSeason; day++) {
        // Cambiar 'temporada' por 'month' para crear la fecha con el formato correcto
        const diaHoy = `${year}-${month + 1}-${day}`;  // Mes + 1 porque en JavaScript los meses son de 0 a 11
        //console.log('Generando datos para el día:', diaHoy);
        sucursal.liberarClientsYHabitaciones(diaHoy);
        const serviciosNuevos = sucursal.promoverComprasDeServicios(diaHoy);
        if (serviciosNuevos) {
          data.push(...serviciosNuevos);
        }

        // Determinar el número de veces que se ejecutará la lógica según la temporada
        let maxReserves = 0;

        if (temporada === TemporadaType.A) {
          maxReserves = MODO_POQUITO ? 3 : 6; // Temporada alta: entre 0 y 20 veces
        } else if (temporada === TemporadaType.B) {
          maxReserves = MODO_POQUITO ? 1 : 1; // Temporada baja: entre 0 y 3 veces
        } else {
          maxReserves = MODO_POQUITO ? 2 : 3; // Temporada ninguna: entre 0 y 8 veces
        }

        // Ejecutar la lógica entre 0 y 'maxReserves' veces
        const numReserves = Math.floor(Math.random() * (maxReserves + 1));

        for (let i = 0; i < numReserves; i++) {
          if (sucursal.isFull()) {
            break;
          }
          // Decidir si recuperar un huésped existente o crear uno nuevo
          const isRecovering = isRecovingChoose(0.25);

          let huesped: Huesped;

          if (isRecovering) {
            const _huesped = sucursal.recoverHuesped(); // Recuperar un huésped
            if (!_huesped) {
              break;
            }

            huesped = _huesped;
          } else {
            huesped = sucursal.addHuesped(Huesped.createRandom()); // Crear un nuevo huésped
            data.push(huesped);
          }

          // Intentar hacer una nueva reserva con el huésped
          const reserva = sucursal.attempNewReserva(huesped, diaHoy);
          if (reserva) {
            data.push(reserva);
          }
        }
      }
      monthIndex++;
    }
  }

  return data;
}
