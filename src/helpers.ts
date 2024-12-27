// Función choose para seleccionar un solo registro aleatorio del arreglo
export function choose<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// Función chooseMultiple para seleccionar varios registros aleatorios del arreglo
export function chooseMultiple<T>(arr: T[], count?: number): T[] {
  // Si no se pasa un count, se elige entre 0 y X registros
  const numberOfItems = count !== undefined ? count : Math.floor(Math.random() * arr.length);
  
  // Si el número de elementos a seleccionar es mayor que el largo del arreglo, se ajusta
  const finalCount = Math.min(numberOfItems, arr.length);

  const selectedItems: T[] = [];
  const availableIndexes = [...Array(arr.length).keys()];

  // Seleccionar aleatoriamente sin repetir
  for (let i = 0; i < finalCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndexes.length);
    const itemIndex = availableIndexes[randomIndex];
    selectedItems.push(arr[itemIndex]);
    availableIndexes.splice(randomIndex, 1); // Eliminar el índice para evitar repeticiones
  }

  return selectedItems;
}

// Función que hace variar un número dentro de un delta dado
export function varyWithinDelta(number: number, delta: number): number {
  // Generamos un número aleatorio entre -delta y +delta
  const variation = Math.random() * (2 * delta) - delta;
  return number + variation;
}

// Función que hace variar un número dentro de un rango porcentual dado
export function varyWithinPercentage(number: number, percentage: number): number {
  // Convertimos el porcentaje a un valor de delta
  const delta = (percentage / 100) * number;

  // Generamos una variación aleatoria entre -delta y +delta
  const variation = Math.random() * (2 * delta) - delta;
  
  return number + variation;
}
