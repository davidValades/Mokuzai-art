import { defineType, defineField } from "sanity";

export default defineType({
  name: "order",
  title: "Gestión de Pedidos",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Nº Pedido",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "customerName", title: "Cliente", type: "string" }),
    defineField({ name: "customerEmail", title: "Email", type: "string" }),
    defineField({
      name: "items",
      title: "Piezas Adquiridas",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productName", type: "string" },
            { name: "price", type: "number" },
            { name: "quantity", type: "number" },
            {
              name: "imageUrl",
              title: "URL de Imagen",
              type: "string",
              description: "URL de la imagen de la obra, almacenada en el momento de la compra.",
            },
            {
              name: "artworkSlug",
              title: "Slug de la Obra",
              type: "string",
              description: "Slug de la obra, almacenado en el momento de la compra para mantener el enlace.",
            },
            defineField({
              name: "artworkRef",
              title: "Obra",
              type: "reference",
              to: [{ type: "artwork" }],
              weak: true,
            }),
          ],
        },
      ],
    }),
    defineField({ name: "totalAmount", title: "Total (€)", type: "number" }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: {
        list: ["Pendiente", "En Preparación", "Enviado", "Entregado"],
      },
      initialValue: "Pendiente",
    }),
    defineField({
      name: "shippingAddress",
      title: "Dirección de Envío",
      type: "text",
    }),
  ],
});
