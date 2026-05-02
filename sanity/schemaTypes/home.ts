import { defineType, defineField } from "sanity";

const languages = [
  { id: "es", title: "Español" },
  { id: "en", title: "Inglés" },
  { id: "ca", title: "Català" },
  { id: "eu", title: "Euskara" },
  { id: "de", title: "Deutsch" },
];

export default defineType({
  name: "home",
  title: "Portada (Hero)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título Interno",
      type: "string",
      description: "Solo para identificarlo en Sanity (ej: 'Hero Principal')",
    }),
    defineField({
      name: "landscapeImage",
      title: "Imagen Horizontal (Escritorio)",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Imagen Vertical (Móvil)",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "music",
      title: "Música Ambiental",
      type: "file",
      description: "Archivo de audio para la atmósfera del sitio (MP3 recomendado).",
      options: { accept: "audio/*" },
    }),
    defineField({
      name: "translations",
      title: "Textos de la Portada",
      type: "object",
      fields: languages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "object",
        fields: [
          { name: "subtitle", title: "Subtítulo (Superior)", type: "string" },
          { name: "mainTitle", title: "Título Principal", type: "string" },
          {
            name: "tagline",
            title: "Frase Evocativa (Inferior)",
            type: "string",
          },
        ],
      })),
    }),
  ],
});
