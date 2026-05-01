import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork";
import collection from "./collection";
import home from "./home";
import workshop from "./workshop";

export const schemaTypes: SchemaTypeDefinition[] = [
  artwork,
  collection,
  home,
  workshop,
];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
