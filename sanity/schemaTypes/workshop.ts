import { defineType, defineField } from "sanity";

const languages = [
  { id: "es", title: "Español" },
  { id: "en", title: "Inglés" },
  { id: "ca", title: "Català" },
  { id: "eu", title: "Euskara" },
  { id: "de", title: "Deutsch" },
];

export default defineType({
  name: "workshop",
  title: "Página: El Taller",
  type: "document",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Título Interno",
      type: "string",
    }),
    // Imágenes para tu efecto de doble exposición
    defineField({
      name: "heroImageLight",
      title: "Hero: Imagen Clara (Fondo)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImageDark",
      title: "Hero: Imagen Chiaroscuro (Hover)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "detailImage",
      title: "Imagen de Detalle (Manos/Herramientas)",
      type: "image",
      options: { hotspot: true },
    }),
    // Textos multilingües
    defineField({
      name: "translations",
      title: "Contenido por Idioma",
      type: "object",
      fields: languages.map((lang) => ({
        name: lang.id,
        title: lang.title,
        type: "object",
        fields: [
          { name: "heroTitle", title: "Título Hero", type: "string" },
          {
            name: "manifestoTitle",
            title: "Manifiesto: Título",
            type: "string",
          },
          {
            name: "manifestoSubtitle",
            title: "Manifiesto: Subtítulo",
            type: "string",
          },
          { name: "manifestoText", title: "Manifiesto: Párrafo", type: "text" },
          { name: "detailTitle", title: "Detalle: Título", type: "string" },
          { name: "detailText", title: "Detalle: Párrafo", type: "text" },
          {
            name: "detailBullets",
            title: "Detalle: Puntos (uno por línea)",
            type: "array",
            of: [{ type: "string" }],
          },
          {
            name: "ctaText",
            title: "CTA - Frase de invitación",
            type: "string",
          },
          { name: "ctaButton", title: "CTA - Texto del botón", type: "string" },
        ],
      })),
    }),
  ],
});
