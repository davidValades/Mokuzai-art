import { NextResponse } from "next/server";
import Stripe from "stripe";
import { serverClient } from "@/lib/sanity";
import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// 1. Inicializamos Stripe con la versión que nos pidió tu despliegue anterior
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-04-22.dahlia",
});

// 2. Stripe is initialized above; Sanity writes use the shared serverClient from lib/sanity.ts

// 3. Configuramos el transporte de email (SMTP)
function createMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // SEGURIDAD: Verificamos que este mensaje viene de Stripe y no de un hacker
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    console.error(`❌ Error de firma en Webhook: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 3. Escuchamos el evento específico: "Pago completado con éxito"
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log(`💰 ¡Pago confirmado! ID: ${paymentIntent.id}`);

    try {
      // 4. RECONSTRUIR ITEMS: Consultamos Sanity para obtener los detalles de cada obra
      const productSlugs = paymentIntent.metadata?.product_slugs;
      const slugsArray = productSlugs ? productSlugs.split(",") : [];

      // orderItems: only schema fields, saved to Sanity
      const orderItems: { _key: string; productName: string; price: number; quantity: number; imageUrl?: string; artworkSlug?: string; artworkRef?: { _type: string; _ref: string; _weak: boolean } }[] = [];
      // emailItems: includes imageUrl for the confirmation email only
      const emailItems: { productName: string; price: number; quantity: number; imageUrl?: string }[] =
        [];

      // Resolve buyer user document once (for all artworks in this order)
      const buyerEmail = paymentIntent.metadata?.customer_email;
      let buyerRef: { _type: string; _ref: string; _weak: boolean } | undefined;
      if (buyerEmail && buyerEmail !== "invitado") {
        const buyerUser = await serverClient.fetch(
          `*[_type == "user" && email == $email][0] { _id }`,
          { email: buyerEmail }
        );
        if (buyerUser?._id) {
          buyerRef = { _type: "reference", _ref: buyerUser._id, _weak: true };
        }
      }

      for (const slug of slugsArray) {
        const artworkQuery = `*[_type == "artwork" && slug.current == $slug][0]{ _id, "slug": slug.current, internalName, price, image { asset->{ url } }, "publicName": translations.es.name }`;
        const artwork = await serverClient.fetch(artworkQuery, { slug });

        if (artwork) {
          const imageUrl: string | undefined = artwork.image?.asset?.url ?? undefined;
          const artworkSlug: string | undefined = artwork.slug ?? undefined;
          const productName: string = artwork.publicName || artwork.internalName;

          orderItems.push({
            _key: crypto.randomUUID(),
            productName,
            price: artwork.price,
            quantity: 1,
            imageUrl,
            artworkSlug,
            artworkRef: { _type: "reference", _ref: artwork._id, _weak: true },
          });

          emailItems.push({
            productName,
            price: artwork.price,
            quantity: 1,
            imageUrl: imageUrl
              ? `${imageUrl}?w=300&h=300&fit=crop&auto=format`
              : undefined,
          });

          // Marcamos la obra como vendida y asignamos el comprador si está registrado
          let patchOp = serverClient.patch(artwork._id).set({ isSold: true });
          if (buyerRef) {
            patchOp = patchOp.set({ buyer: buyerRef });
          }
          await patchOp.commit();

          console.log(`🎨 Obra [${slug}] marcada como VENDIDA y descatalogada.`);
        }
      }

      // 5. CREACIÓN DEL PEDIDO EN SANITY con los campos correctos del schema
      const orderNumber = paymentIntent.id;

      await serverClient.create({
        _type: "order",
        orderNumber,
        customerName: paymentIntent.shipping?.name || "Cliente Mokuzai",
        customerEmail:
          paymentIntent.metadata?.customer_email || "Email no proporcionado",
        items: orderItems,
        totalAmount: paymentIntent.amount / 100, // Convertimos céntimos a Euros
        status: "Pendiente",
        shippingAddress: paymentIntent.shipping?.address
          ? [
              paymentIntent.shipping.address.line1,
              paymentIntent.shipping.address.line2,
              paymentIntent.shipping.address.city,
              paymentIntent.shipping.address.postal_code,
              paymentIntent.shipping.address.country,
            ]
              .filter(Boolean)
              .join(", ")
          : "",
      });

      console.log("✅ Pedido registrado en la base de datos de Sanity");

      // Añadimos las obras compradas al array "purchases" del usuario registrado
      if (buyerRef) {
        const artworkRefs = orderItems
          .filter((item) => item.artworkRef)
          .map((item) => ({
            _key: crypto.randomUUID(),
            _type: "reference" as const,
            _ref: item.artworkRef!._ref,
            _weak: true,
          }));
        if (artworkRefs.length > 0) {
          await serverClient
            .patch(buyerRef._ref)
            .setIfMissing({ purchases: [] })
            .append("purchases", artworkRefs)
            .commit();
          console.log(`🗂️ Obras añadidas al perfil del coleccionista (${buyerRef._ref})`);
        }
      }

      // 6. ENVÍO DE EMAILS automático al cliente y a Ricardo
      try {
        const transporter = createMailTransporter();
        const customerEmail = paymentIntent.metadata?.customer_email;
        const adminEmail = process.env.ADMIN_EMAIL || "davidmokuzaiart@gmail.com";
        const baseUrl = "https://mokuzai-art.es";
        const orderRef = orderNumber.slice(-8);
        const GUEST_EMAIL_VALUE = "invitado";

        const itemsHtml = emailItems
          .map(
            (item) =>
              `<tr>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
                  ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${escapeHtml(item.productName)}" width="80" height="80" style="display:block;object-fit:cover;margin-bottom:6px;border:1px solid #e5e7eb;">` : ""}
                  ${escapeHtml(item.productName)}
                </td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;vertical-align:top;">${item.price.toFixed(2)} €</td>
              </tr>`,
          )
          .join("");

        const shippingAddress = paymentIntent.shipping?.address
          ? [
              paymentIntent.shipping.address.line1,
              paymentIntent.shipping.address.line2,
              paymentIntent.shipping.address.city,
              paymentIntent.shipping.address.postal_code,
              paymentIntent.shipping.address.country,
            ]
              .filter(Boolean)
              .join(", ")
          : "No proporcionada";

        const totalFormatted = (paymentIntent.amount / 100).toFixed(2);

        // Email al cliente
        if (customerEmail && customerEmail !== GUEST_EMAIL_VALUE) {
          await transporter.sendMail({
            from: `"Mokuzai Art" <${process.env.SMTP_USER}>`,
            to: customerEmail,
            subject: `✅ Confirmación de tu pedido en Mokuzai Art (#${orderRef})`,
            html: `
              <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fafaf9;padding:40px;border:1px solid #e5e7eb;">
                <h1 style="font-size:24px;color:#3b2f1e;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">Mokuzai Art</h1>
                <hr style="border:none;border-top:1px solid #d6cfc4;margin:24px 0;">
                <p style="font-size:16px;color:#3b2f1e;">Hola ${paymentIntent.shipping?.name || ""},</p>
                <p style="color:#5c4a35;line-height:1.7;">
                  Gracias por tu compra. Tu pedido ha sido confirmado y está siendo preparado con todo el cuidado que merece.
                </p>
                <table style="width:100%;border-collapse:collapse;margin:24px 0;">
                  <thead>
                    <tr style="background:#f0ebe4;">
                      <th style="padding:8px 12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#5c4a35;">Obra</th>
                      <th style="padding:8px 12px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#5c4a35;">Precio</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                  <tfoot>
                    <tr>
                      <td style="padding:12px;font-weight:bold;color:#3b2f1e;">Total</td>
                      <td style="padding:12px;text-align:right;font-weight:bold;color:#3b2f1e;">${totalFormatted} €</td>
                    </tr>
                  </tfoot>
                </table>
                <p style="color:#5c4a35;"><strong>Dirección de envío:</strong> ${shippingAddress}</p>
                <p style="color:#5c4a35;"><strong>Referencia:</strong> ${orderRef}</p>
                <hr style="border:none;border-top:1px solid #d6cfc4;margin:24px 0;">
                <p style="font-size:12px;color:#9ca3af;text-align:center;">
                  Si tienes alguna pregunta, puedes contactarnos en <a href="mailto:${adminEmail}" style="color:#3b2f1e;">${adminEmail}</a>
                  <br>
                  <a href="${baseUrl}" style="color:#3b2f1e;">${baseUrl}</a>
                </p>
              </div>
            `,
          });
          console.log(`📧 Email de confirmación enviado al cliente: ${customerEmail}`);
        }

        // Email a Ricardo (administrador)
        await transporter.sendMail({
          from: `"Mokuzai Art - Notificaciones" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: `🛒 Nuevo pedido recibido (#${orderRef}) — ${totalFormatted} €`,
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fafaf9;padding:40px;border:1px solid #e5e7eb;">
              <h1 style="font-size:24px;color:#3b2f1e;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">Nuevo Pedido</h1>
              <hr style="border:none;border-top:1px solid #d6cfc4;margin:24px 0;">
              <p style="font-size:16px;color:#3b2f1e;"><strong>Cliente:</strong> ${paymentIntent.shipping?.name || "Desconocido"}</p>
              <p style="color:#5c4a35;"><strong>Email:</strong> ${customerEmail || "No proporcionado"}</p>
              <p style="color:#5c4a35;"><strong>Dirección de envío:</strong> ${shippingAddress}</p>
              <table style="width:100%;border-collapse:collapse;margin:24px 0;">
                <thead>
                  <tr style="background:#f0ebe4;">
                    <th style="padding:8px 12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#5c4a35;">Obra</th>
                    <th style="padding:8px 12px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#5c4a35;">Precio</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr>
                    <td style="padding:12px;font-weight:bold;color:#3b2f1e;">Total cobrado</td>
                    <td style="padding:12px;text-align:right;font-weight:bold;color:#3b2f1e;">${totalFormatted} €</td>
                  </tr>
                </tfoot>
              </table>
              <p style="color:#5c4a35;"><strong>ID de pago Stripe:</strong> <code>${paymentIntent.id}</code></p>
              <hr style="border:none;border-top:1px solid #d6cfc4;margin:24px 0;">
              <p style="font-size:12px;color:#9ca3af;text-align:center;">Gestiona el pedido en Sanity Studio: <a href="${baseUrl}/studio" style="color:#3b2f1e;">${baseUrl}/studio</a></p>
            </div>
          `,
        });
        console.log(`📧 Email de notificación enviado al administrador: ${adminEmail}`);
      } catch (emailError) {
        // El error de email no debe detener el flujo ni hacer que Stripe reintente
        console.error("⚠️ Error enviando emails (el pedido sí se registró):", emailError);
      }
    } catch (error) {
      console.error("❌ Error al procesar el webhook en Sanity:", error);
      // Devolvemos 500 para que Stripe reintente el envío del webhook más tarde
      return new NextResponse("Error procesando base de datos", {
        status: 500,
      });
    }
  }

  // Respondemos a Stripe con un 200 OK para que sepa que hemos recibido el aviso
  return NextResponse.json({ received: true });
}
