"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// 1. Inicializamos Stripe fuera del componente para no recargarlo
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// --- COMPONENTE INTERNO: TU FORMULARIO + LA TARJETA ---
function InnerCheckoutForm({ dict, lang, clientSecret }: { dict: any; lang: string; clientSecret: string }) {
  const { cartTotal } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill fields when the user is logged in
  useEffect(() => {
    if (!session?.user) return;

    setEmail(session.user.email ?? "");
    setName(session.user.name ?? "");

    // Fetch last shipping address from most recent order
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.address) {
          setAddress(data.user.address);
        }
      })
      .catch((err) => console.error("Error fetching user address:", err));
  }, [session]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // For guest users, update the PaymentIntent metadata with their email
    if (!session?.user?.email && email) {
      try {
        const parts = clientSecret.split("_secret_");
        const paymentIntentId = parts.length === 2 ? parts[0] : null;
        if (paymentIntentId) {
          const res = await fetch("/api/checkout", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId, email }),
          });
          if (!res.ok) {
            console.error("Failed to update PaymentIntent email:", await res.text());
          }
        }
      } catch (err) {
        console.error("Error updating guest email in PaymentIntent:", err);
      }
    }

    // Aquí es donde Stripe cifra la tarjeta y procesa el cobro
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirigimos a la página de éxito según el idioma actual
        return_url: `${window.location.origin}/${lang}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name,
            email,
          },
        },
        shipping: {
          name,
          address: {
            line1: address,
            // Spain is the only country currently supported for shipping
            country: "ES",
          },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message || "Error al procesar el pago");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePayment} className="space-y-8 max-w-xl mx-auto">
      {/* TUS CAMPOS DE ENVÍO ORIGINALES */}
      <div className="space-y-4">
        <input
          required
          type="email"
          placeholder={dict.checkout.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 bg-transparent border-b border-[#706D54]/30 focus:border-[#706D54] outline-none transition-all font-inter text-[#706D54] placeholder:text-[#706D54]/40"
        />
        <input
          required
          type="text"
          placeholder={dict.checkout.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 bg-transparent border-b border-[#706D54]/30 focus:border-[#706D54] outline-none transition-all font-inter text-[#706D54] placeholder:text-[#706D54]/40"
        />
        <textarea
          required
          placeholder={dict.checkout.address}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-4 bg-transparent border-b border-[#706D54]/30 focus:border-[#706D54] outline-none transition-all font-inter text-[#706D54] placeholder:text-[#706D54]/40 min-h-[100px]"
        />
      </div>

      {/* EL CAJÓN DE LA TARJETA DE CRÉDITO (STRIPE) */}
      <div className="pt-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {/* MANEJO DE ERRORES (Fondos insuficientes, etc.) */}
      {error && (
        <p className="text-red-900 text-xs font-inter bg-red-50 p-4 border border-red-200">
          {error}
        </p>
      )}

      {/* TU CAJA DE TOTAL Y BOTÓN DE PAGO */}
      <div className="bg-[#706D54]/5 p-8 rounded-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="font-inter text-xs tracking-widest uppercase text-[#706D54]/60">
            Total de la obra
          </span>
          <span className="font-cormorant text-2xl text-[#706D54]">
            {cartTotal} €
          </span>
        </div>
        <button
          disabled={loading || !stripe || !elements}
          className="w-full py-5 bg-[#706D54] text-[#DBDBDB] font-inter text-xs tracking-[0.2em] uppercase transition-all hover:bg-[#5a5743] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? dict.checkout.processing : dict.checkout.pay_now}
        </button>
      </div>
    </form>
  );
}

// --- COMPONENTE EXPORTADO: EL ENVOLTORIO (WRAPPER) ---
export default function CheckoutForm({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const { cart, cartTotal } = useCart();
  const { data: session, status: sessionStatus } = useSession();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Esperamos a que la sesión haya cargado antes de crear el PaymentIntent
    if (cart.length > 0 && sessionStatus !== "loading") {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos el carrito real a nuestra API para que calcule el precio
        body: JSON.stringify({ items: cart, total: cartTotal, userEmail: session?.user?.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
        });
    }
  }, [cart, cartTotal, session, sessionStatus]);

  if (cart.length === 0)
    return (
      <p className="text-center font-cormorant text-[#706D54]">
        {dict.cart.empty_state}
      </p>
    );

  // Forzamos a que Stripe respete tu paleta de colores y bordes
  const appearance = {
    theme: "flat" as const,
    variables: {
      fontFamily: "Inter, system-ui, sans-serif",
      colorBackground: "transparent",
      colorText: "#706D54",
      colorPrimary: "#A08963",
      borderRadius: "0px",
    },
    rules: {
      ".Input": {
        border: "1px solid rgba(112, 109, 84, 0.3)",
        boxShadow: "none",
        padding: "12px",
      },
      ".Input:focus": {
        border: "1px solid #706D54",
      },
      ".Label": {
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        fontSize: "0.7rem",
        color: "#706D54",
      },
    },
  };

  return (
    <div className="w-full">
      {clientSecret ? (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <InnerCheckoutForm dict={dict} lang={lang} clientSecret={clientSecret} />
        </Elements>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-y-2 border-[#706D54] rounded-full animate-spin"></div>
          <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#706D54]/60">
            Conectando con pasarela segura...
          </span>
        </div>
      )}
    </div>
  );
}
