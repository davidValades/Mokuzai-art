import { defineType, defineField } from "sanity";

const languages = [
  { id: "es", title: "Español" },
  { id: "en", title: "Inglés" },
  { id: "ca", title: "Català" },
  { id: "eu", title: "Euskara" },
  { id: "de", title: "Deutsch" },
];

export default defineType({
  name: "artwork",
  title: "Obras de Arte",
  type: "document",
  fields: [
    defineField({
      name: "internalName",
      title: "Nombre Interno",
      type: "string",
      description: "Identificador para el taller (no visible en la web).",
      validation: (Rule) => Rule.required(),
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
      description: "El carácter tradicional que representa la obra (ej: 行灯).",
    }),
    defineField({
      name: "price",
      title: "Precio (€)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "category",
      title: "Colección",
      type: "string",
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
      name: "image",
      title: "Imagen Principal",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "additionalImages",
      title: "Imágenes Adicionales (galería)",
      type: "array",
      description: "Añade entre 1 y 4 fotos adicionales que se mostrarán en la galería del producto.",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "hoverImage",
      title: "Imagen Iluminada (Efecto noche)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "translations",
      title: "Contenido Multilingüe",
      type: "object",
      fields: languages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "object",
        fields: [
          { name: "name", title: "Nombre Público", type: "string" },
          { name: "description", title: "Descripción Evocativa", type: "text" },
          {
            name: "details",
            title: "Detalles Técnicos",
            type: "array",
            of: [{ type: "string" }],
          },
        ],
      })),
    }),
  ],
});
