"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CheckoutForm({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const { cart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Lógica de Stripe vendrá aquí
    console.log("Procesando pedido de Mokuzai Art...");
  };

  if (cart.length === 0)
    return (
      <p className="text-center font-cormorant text-[#706D54]">
        {dict.cart.empty_state}
      </p>
    );

  return (
    <form onSubmit={handlePayment} className="space-y-8 max-w-xl mx-auto">
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
          disabled={loading}
          className="w-full py-5 bg-[#706D54] text-[#DBDBDB] font-inter text-xs tracking-[0.2em] uppercase transition-all hover:bg-[#5a5743] disabled:opacity-50"
        >
          {loading ? dict.checkout.processing : dict.checkout.pay_now}
        </button>
      </div>
    </form>
  );
}
