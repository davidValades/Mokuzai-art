import { NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "@/lib/sanity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

// Clave secreta del webhook de Stripe
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    // Verificamos que el mensaje viene realmente de Stripe y no de un hacker
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    console.error("Error de firma del Webhook:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  // Si el pago se ha completado con éxito
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Rescatamos los datos que ocultamos en el paso anterior (metadata)
      const items = JSON.parse(session.metadata?.orderItems || "[]");

      // Creamos el documento en Sanity siguiendo tu esquema "order"
      await client.create({
        _type: "order",
        orderNumber: session.id.slice(-8).toUpperCase(), // Un ID corto para el cliente
        customerName: session.customer_details?.name || "Cliente",
        customerEmail: session.customer_details?.email || "Sin email",
        totalAmount: (session.amount_total || 0) / 100, // Stripe lo da en céntimos
        status: "Pendiente",
        shippingAddress: session.customer_details?.address
          ? `${session.customer_details.address.line1}, ${session.customer_details.address.city}`
          : "Sin dirección",
        items: items.map((item: any) => ({
          _key: Math.random().toString(36).substring(7), // Sanity exige una key única en arrays
          productName: item.name,
          price: item.price,
          quantity: item.qty,
        })),
      });

      console.log("✅ Pedido guardado en Sanity con éxito");
    } catch (err) {
      console.error("❌ Error guardando el pedido en Sanity:", err);
      return NextResponse.json(
        { error: "Error guardando en BD" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
