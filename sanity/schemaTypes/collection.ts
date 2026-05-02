// sanity/schemaTypes/collection.ts
import { defineType, defineField } from "sanity";

const languages = [
  { id: "es", title: "Español" },
  { id: "en", title: "Inglés" },
  { id: "ca", title: "Català" },
  { id: "eu", title: "Euskara" },
  { id: "de", title: "Deutsch" },
];

export default defineType({
  name: "collection",
  title: "Colecciones Maestras",
  type: "document",
  fields: [
    defineField({
      name: "internalName",
      title: "Nombre Interno",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categoryId",
      title: "ID de Categoría (Artwork)",
      type: "string",
      description:
        "Valor de categoría exacto que se usa en las obras (ej: Kazaru, Meisho). Necesario para que el enlace desde la página principal filtre correctamente.",
      options: {
        list: [
          { title: "Meisho (Estructuras y Luz)", value: "Meisho" },
          { title: "Shokutaku (Culinario y Té)", value: "Shokutaku" },
          { title: "Budō (Artes Marciales)", value: "Budō" },
          { title: "Kazaru (Piezas Decorativas)", value: "Kazaru" },
        ],
      },
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "internalName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kanji",
      title: "Kanji Japonés",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Imagen de Portada",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "layout",
      title: "Tamaño en el Grid (Diseño Asimétrico)",
      type: "string",
      description:
        "Define el peso visual de esta colección en la página principal.",
      options: {
        list: [
          {
            title: "Grande (Horizontal)",
            value: "md:col-span-8 h-[60vh] md:h-[70vh]",
          },
          {
            title: "Mediano (Vertical)",
            value: "md:col-span-4 h-[50vh] md:h-[70vh]",
          },
          {
            title: "Ancho Completo (Panorámico)",
            value: "md:col-span-12 h-[40vh] md:h-[50vh]",
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "translations",
      title: "Traducciones",
      type: "object",
      fields: languages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "object",
        fields: [
          { name: "title", title: "Título de la Colección", type: "string" },
          { name: "description", title: "Descripción Evocativa", type: "text" },
        ],
      })),
    }),
  ],
});
