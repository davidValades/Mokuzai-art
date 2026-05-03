import { NextResponse } from "next/server";
import Stripe from "stripe";

// 1. Inicializamos Stripe de forma segura con tu clave privada
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(request: Request) {
  try {
    // Leemos los datos que nos envía el frontend (ej. el carrito y el email)
    const body = await request.json();
    const { items, userEmail } = body;

    const calculateOrderAmount = () => {
      // TODO: Reemplazar por la consulta a Sanity
      return 18500;
    };

    // 2. Creamos la "Intención de Pago" en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(),
      currency: "eur",

      // Magia pura: Esto le dice a Stripe que queremos guardar el método de pago
      // del cliente para usarlo en el futuro de forma segura.
      setup_future_usage: "on_session",

      // Opcional: Guardamos datos extra en el recibo de Stripe
      metadata: {
        customer_email: userEmail || "invitado",
        order_type: "mokuzai_art_collection",
      },
      // Habilitamos los métodos de pago automáticos (Apple Pay, Google Pay, Tarjetas...)
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 3. Devolvemos el "Secreto del Cliente" (Client Secret) al frontend
    // Esto NO es tu clave privada. Es un token de 1 solo uso que autoriza
    // al formulario a cobrar exactamente esta cantidad y nada más.
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error fatal en el checkout:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar el pago" },
      { status: 500 },
    );
  }
}
