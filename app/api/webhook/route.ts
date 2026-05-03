import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";

// 1. Inicializamos Stripe con la versión que nos pidió tu despliegue anterior
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-04-22.dahlia",
});

// 2. Configuramos el cliente de Sanity con permisos de escritura
// Necesitarás crear el token 'SANITY_API_WRITE_TOKEN' en manage.sanity.io
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false, // Importante: false para que la escritura sea inmediata
  apiVersion: "2024-03-12",
});

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
      // 4. CREACIÓN DEL PEDIDO EN SANITY
      await sanityClient.create({
        _type: "order",
        orderId: paymentIntent.id,
        customerName: paymentIntent.shipping?.name || "Cliente Mokuzai",
        email:
          paymentIntent.metadata?.customer_email || "Email no proporcionado",
        amount: paymentIntent.amount / 100, // Convertimos céntimos a Euros
        status: "paid",
        createdAt: new Date().toISOString(),
      });

      console.log("✅ Pedido registrado en la base de datos de Sanity");

      // 5. DESCATALOGAR LAS OBRAS VENDIDAS
      const productSlugs = paymentIntent.metadata?.product_slugs;

      if (productSlugs) {
        // Separamos los slugs (por si ha comprado más de una obra)
        const slugsArray = productSlugs.split(",");

        for (const slug of slugsArray) {
          // Buscamos el ID interno del documento en Sanity usando el slug
          const query = `*[_type == "artwork" && slug.current == $slug][0]._id`;
          const artworkId = await sanityClient.fetch(query, { slug });

          if (artworkId) {
            // Actualizamos el campo 'isSold' a true
            await sanityClient.patch(artworkId).set({ isSold: true }).commit();

            console.log(
              `🎨 Obra [${slug}] marcada como VENDIDA y descatalogada.`,
            );
          }
        }
      }

      // TODO (Siguiente paso): Enviar email automático a Ricardo y al Cliente
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
