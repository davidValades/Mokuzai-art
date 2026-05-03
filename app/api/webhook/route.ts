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
      // 4. RECONSTRUIR ITEMS: Consultamos Sanity para obtener los detalles de cada obra
      const productSlugs = paymentIntent.metadata?.product_slugs;
      const slugsArray = productSlugs ? productSlugs.split(",") : [];

      const items: { productName: string; price: number; quantity: number }[] =
        [];

      for (const slug of slugsArray) {
        const artworkQuery = `*[_type == "artwork" && slug.current == $slug][0]{ _id, internalName, price }`;
        const artwork = await sanityClient.fetch(artworkQuery, { slug });

        if (artwork) {
          items.push({
            productName: artwork.internalName,
            price: artwork.price,
            quantity: 1,
          });

          // Marcamos la obra como vendida
          await sanityClient
            .patch(artwork._id)
            .set({ isSold: true })
            .commit();

          console.log(`🎨 Obra [${slug}] marcada como VENDIDA y descatalogada.`);
        }
      }

      // 5. CREACIÓN DEL PEDIDO EN SANITY con los campos correctos del schema
      const orderNumber = paymentIntent.id;

      await sanityClient.create({
        _type: "order",
        orderNumber,
        customerName: paymentIntent.shipping?.name || "Cliente Mokuzai",
        customerEmail:
          paymentIntent.metadata?.customer_email || "Email no proporcionado",
        items,
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
