import { type SchemaTypeDefinition } from "sanity";
import artwork from "./artwork";
import collection from "./collection";
import home from "./home";
import workshop from "./workshop";
import order from "./order";
import user from "./user";
import siteSettings from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  artwork,
  collection,
  home,
  workshop,
  order,
  user,
  siteSettings,
];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
