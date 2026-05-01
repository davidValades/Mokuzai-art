import "server-only";

// Definimos los idiomas soportados por Mokuzai Art
export type Locale = "es" | "en" | "eu" | "ca" | "de";

// Mapeamos cada idioma a su archivo JSON correspondiente
const dictionaries = {
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ca: () => import("./dictionaries/ca.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default),
  eu: () => import("./dictionaries/eu.json").then((module) => module.default),
  // Añadiremos el resto aquí conforme los traduzcamos:
  // eu: () => import('./dictionaries/eu.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  // Si nos piden un idioma que no tenemos, devolvemos español por defecto como salvavidas
  return dictionaries[locale]?.() ?? dictionaries.es();
};
