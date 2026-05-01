import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork";
import collection from "./collection";
import home from "./home";
import workshop from "./workshop";
import order from "./order";

export const schemaTypes: SchemaTypeDefinition[] = [
  artwork,
  collection,
  home,
  workshop,
  order,
];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
