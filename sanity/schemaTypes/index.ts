import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork";
import collection from "./collection";
import home from "./home";

export const schemaTypes: SchemaTypeDefinition[] = [artwork, collection, home];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
