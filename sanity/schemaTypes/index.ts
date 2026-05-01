import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork"; // Importamos la obra que acabamos de crear

// Exportamos schemaTypes para que coincida con lo que busca tu sanity.config.ts
export const schemaTypes: SchemaTypeDefinition[] = [artwork];

// Mantenemos este objeto por si Sanity lo usa internamente en su config base
export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
