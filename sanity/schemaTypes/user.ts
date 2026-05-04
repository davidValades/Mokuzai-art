import { defineType, defineField } from "sanity";

export default defineType({
  name: "user",
  title: "Coleccionistas",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "image", title: "Imagen", type: "url" }),
    defineField({
      name: "role",
      title: "Rol",
      type: "string",
      options: { list: ["cliente", "admin"] },
      initialValue: "cliente",
    }),
    defineField({
      name: "purchases",
      title: "Obras Adquiridas",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "artwork" }],
          weak: true,
        },
      ],
    }),
  ],
});
