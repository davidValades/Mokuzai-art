// schemas/siteSettings.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Configuración Global",
  type: "document",
  fields: [
    defineField({
      name: "ambientMusic",
      title: "Música de Atmósfera",
      description: "Sube el archivo MP3 que sonará de fondo (Lujo silencioso).",
      type: "file",
      options: {
        accept: "audio/*",
      },
    }),
  ],
});
