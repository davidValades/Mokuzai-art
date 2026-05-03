"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// 1. Inicializamos Stripe fuera del componente para no recargarlo
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- COMPONENTE INTERNO: TU FORMULARIO + LA TARJETA ---
function InnerCheckoutForm({ dict, lang }: { dict: any; lang: string }) {
  const { cartTotal } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // Aquí es donde Stripe cifra la tarjeta y procesa el cobro
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirigimos a la página de éxito según el idioma actual
        return_url: `${window.location.origin}/${lang}/checkout/success`,
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
          className="w-full p-4 bg-transparent border-b border-[#706D54]/30 focus:border-[#706D54] outline-none transition-all font-inter text-[#706D54] placeholder:text-[#706D54]/40"
        />
        <input
          required
          type="text"
          placeholder={dict.checkout.name}
          className="w-full p-4 bg-transparent border-b border-[#706D54]/30 focus:border-[#706D54] outline-none transition-all font-inter text-[#706D54] placeholder:text-[#706D54]/40"
        />
        <textarea
          required
          placeholder={dict.checkout.address}
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
export default function CheckoutForm({ dict, lang }: { dict: any; lang: string }) {
  const { cart, cartTotal } = useCart();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Si hay cosas en el carrito, pedimos el permiso de cobro al backend
    if (cart.length > 0) {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos el carrito real a nuestra API para que calcule el precio
        body: JSON.stringify({ items: cart, total: cartTotal }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
        });
    }
  }, [cart, cartTotal]);

  if (cart.length === 0)
    return (
      <p className="text-center font-cormorant text-[#706D54]">
        {dict.cart.empty_state}
      </p>
    );

  // Forzamos a que Stripe respete tu paleta de colores y bordes
  const appearance = {
    theme: 'flat' as const,
    variables: {
      fontFamily: 'Inter, system-ui, sans-serif',
      colorBackground: 'transparent',
      colorText: '#706D54',
      colorPrimary: '#A08963',
      borderRadius: '0px',
    },
    rules: {
      '.Input': {
        border: '1px solid rgba(112, 109, 84, 0.3)',
        boxShadow: 'none',
        padding: '12px',
      },
      '.Input:focus': {
        border: '1px solid #706D54',
      },
      '.Label': {
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        fontSize: '0.7rem',
        color: '#706D54',
      }
    }
  };

  return (
    <div className="w-full">
      {clientSecret ? (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <InnerCheckoutForm dict={dict} lang={lang} />
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
```</Elements>