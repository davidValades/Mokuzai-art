// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Mokuzai Art Studio",

  // Usamos las variables que Sanity creó en tu .env.local
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,

  basePath: "/studio", // Esto es lo que busca el navegador

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
