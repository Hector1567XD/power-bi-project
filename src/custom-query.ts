import { Client } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function customQueryOne(client: Client) {
    console.log('CONSULTA #1 | Personas con más de una reserva:');

    const query = `
        SELECT 
            p.persona_id,
            p.nombre,
            p.cedula,
            p.fecha_nacimiento,
            p.genero,
            COUNT(r.reserva_id) AS cantidad_reservas
        FROM 
            persona p
        INNER JOIN 
            huesped h ON p.persona_id = h.persona_id
        INNER JOIN 
            reserva r ON h.huesped_id = r.huesped_id
        GROUP BY 
            p.persona_id, p.nombre, p.cedula, p.fecha_nacimiento, p.genero
        HAVING 
            COUNT(r.reserva_id) > 1
        LIMIT 5;
    `; // Aquí puedes poner cualquier consulta que desees ejecutar

    const result = await client.query(query);
    console.log('Resultado de la consulta:');
    console.table(result.rows);
}

async function customQueryTwo(client: Client) {
    console.log('CONSULTA #2 | Personas sin reservas:');

    const query = `
       SELECT 
            p.persona_id,
            p.nombre,
            p.cedula,
            p.fecha_nacimiento,
            p.genero
        FROM 
            persona p
        LEFT JOIN 
            huesped h ON p.persona_id = h.persona_id
        LEFT JOIN 
            reserva r ON h.huesped_id = r.huesped_id
        WHERE 
            r.reserva_id IS NULL
        LIMIT 5;
    `; // Aquí puedes poner cualquier consulta que desees ejecutar

    
    const result = await client.query(query);
    console.log('Resultado de la consulta:');
    console.table(result.rows);
}

async function getQuantityOfReserves(client: Client) {
    console.log('CONSULTA #3 | Cantidad de reservas totales del sistema:');

    const query = `
        SELECT 
            COUNT(*)
        FROM 
            reserva r
        ;
    `; // Aquí puedes poner cualquier consulta que desees ejecutar

    const result = await client.query(query);
    console.log('Resultado de la consulta:');
    console.table(result.rows);
}

async function getQuantityOfHuespedes(client: Client) {
    console.log('CONSULTA #4 | Cantidad de huespedes totales del sistema:');

    const query = `
        SELECT 
            COUNT(*)
        FROM 
            huesped h
        ;
    `; // Aquí puedes poner cualquier consulta que desees ejecutar

    const result = await client.query(query);
    console.log('Resultado de la consulta:');
    console.table(result.rows);
}

// Función para ejecutar una consulta SQL personalizada
export const executeCustomQuery = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  if (process.env.STEP_4_EXECUTE_QUERY === 'true') {
    try {
      console.log('Ejecutando consultas personalizada...');

        await client.connect();
        await customQueryOne(client);
        await customQueryTwo(client);
        await getQuantityOfReserves(client);
        await getQuantityOfHuespedes(client);

    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      process.exit(1); // Terminar si ocurre un error en la consulta
    } finally {
      await client.end(); // Asegurarse de cerrar la conexión al final
    }
  } else {
    console.log('STEP_4_EXECUTE_QUERY no está activado, omitiendo paso 4.');
  }
};