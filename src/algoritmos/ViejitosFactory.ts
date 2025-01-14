import { Continentes } from "../types";

enum EdadCesgo {
  Viejitos = 'viejitos',
  AdultosAvanzados = 'adultos-avanzados',
  Adultos = 'adultos',
  JovenesAdultos = 'jovenes-adultos',
  Jovenes = 'jovenes'
}

const CONTINENTES_EDAD_CESGO: Record<Continentes, EdadCesgo> = {
  [Continentes.Africa]: EdadCesgo.JovenesAdultos,
  [Continentes.Asia]: EdadCesgo.Jovenes,
  [Continentes.Europa]: EdadCesgo.Jovenes,
  [Continentes.AmericaDelNorte]: EdadCesgo.Adultos,
  [Continentes.AmericaDelSur]: EdadCesgo.AdultosAvanzados,
  [Continentes.Oceanía]: EdadCesgo.AdultosAvanzados,
  [Continentes.Antartida]: EdadCesgo.Viejitos
}

export default class ViejitosFactory {
  // Método estático para obtener la fecha de nacimiento de un huésped
  static getFechaNacimiento(fechaSimulacion?: string, continente?: Continentes): string {
    const fechaBase = fechaSimulacion ? new Date(fechaSimulacion) : new Date();

    // Rango fijo de edad
    const edadMinima = 18;
    const edadMaxima = 65;

    // Ajustar la probabilidad de edad según el continente (cesgo de edad)
    let probabilidadJoven = 0.33;  // Probabilidad de ser joven (más cerca de 18)
    let probabilidadMedio = 0.33;  // Probabilidad de tener una edad media
    let probabilidadMayor = 0.33;  // Probabilidad de ser mayor (más cerca de 65)

    switch (CONTINENTES_EDAD_CESGO[continente || Continentes.AmericaDelNorte]) {
      case EdadCesgo.Viejitos:
        probabilidadJoven = 0.2;   // Menos probabilidad de ser joven
        probabilidadMedio = 0.3;   // Probabilidad media de edad
        probabilidadMayor = 0.5;   // Más probabilidad de ser mayor
        break;
      case EdadCesgo.AdultosAvanzados:
        probabilidadJoven = 0.3;   // Menos probabilidad de ser joven
        probabilidadMedio = 0.4;   // Probabilidad media de edad
        probabilidadMayor = 0.3;   // Probabilidad media de ser mayor
        break;
      case EdadCesgo.Adultos:
        probabilidadJoven = 0.4;   // Probabilidad media de ser joven
        probabilidadMedio = 0.3;   // Probabilidad de tener una edad media
        probabilidadMayor = 0.3;   // Probabilidad media de ser mayor
        break;
      case EdadCesgo.JovenesAdultos:
        probabilidadJoven = 0.5;   // Mayor probabilidad de ser joven
        probabilidadMedio = 0.3;   // Probabilidad media de tener edad media
        probabilidadMayor = 0.2;   // Menos probabilidad de ser mayor
        break;
      case EdadCesgo.Jovenes:
        probabilidadJoven = 0.7;   // Mucha probabilidad de ser joven
        probabilidadMedio = 0.2;   // Baja probabilidad de tener edad media
        probabilidadMayor = 0.1;   // Muy baja probabilidad de ser mayor
        break;
    }

    // Ajuste de probabilidad para asegurar que la suma sea 1
    const sumaProbabilidades = probabilidadJoven + probabilidadMedio + probabilidadMayor;
    if (sumaProbabilidades !== 1) {
      // Ajustamos las probabilidades para que sumen 1
      const ajuste = 1 - sumaProbabilidades;
      probabilidadMayor += ajuste;  // Ajuste en la probabilidad de ser mayor
    }

    // 5% de posibilidad de generar una edad completamente aleatoria entre 18 y 65
    const aleatorio = Math.random();
    if (aleatorio < 0.05) {
      // Si es menor al 5%, generamos una edad aleatoria completamente dentro del rango
      return this.generarEdadAleatoria(edadMinima, edadMaxima);
    }

    // Generar una edad ajustada a las probabilidades de ser joven, medio o mayor
    let edad: number;
    const aleatorioTipoEdad = Math.random();

    if (aleatorioTipoEdad < probabilidadJoven) {
      // Generar edad más cercana a 18
      edad = Math.floor(Math.random() * (30)) + edadMinima;  // Edad entre 18 y 47
    } else if (aleatorioTipoEdad < probabilidadJoven + probabilidadMedio) {
      // Generar edad más cercana a 40
      edad = Math.floor(Math.random() * (edadMaxima - edadMinima + 1)) + edadMinima;  // Edad entre 18 y 65
    } else {
      // Generar edad más cercana a 65
      edad = Math.floor(Math.random() * (edadMaxima - 47 + 1)) + 47;  // Edad entre 47 y 65
    }

    // Calcular el año de nacimiento
    const anioNacimiento = fechaBase.getFullYear() - edad;

    // Generar un mes y día aleatorio
    const mesNacimiento = Math.floor(Math.random() * 12);
    const diaNacimiento = Math.floor(Math.random() * 28) + 1; // Evitar problemas con días inválidos

    // Crear la fecha de nacimiento y devolverla como cadena en formato "YYYY-MM-DD"
    const fechaNacimiento = new Date(anioNacimiento, mesNacimiento, diaNacimiento);
    return fechaNacimiento.toISOString().split('T')[0];
  }

  // Método para generar una edad completamente aleatoria entre 18 y 65
  private static generarEdadAleatoria(edadMinima: number, edadMaxima: number): string {
    const edad = Math.floor(Math.random() * (edadMaxima - edadMinima + 1)) + edadMinima;
    const fechaBase = new Date();
    const anioNacimiento = fechaBase.getFullYear() - edad;
    const mesNacimiento = Math.floor(Math.random() * 12);
    const diaNacimiento = Math.floor(Math.random() * 28) + 1; // Evitar problemas con días inválidos
    const fechaNacimiento = new Date(anioNacimiento, mesNacimiento, diaNacimiento);
    return fechaNacimiento.toISOString().split('T')[0];
  }
}
