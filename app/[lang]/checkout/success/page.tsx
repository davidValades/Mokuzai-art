"use client";

import { use, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); // Limpiamos el carrito automáticamente
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#DBDBDB]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border border-[#706D54]/30 p-12 text-center bg-white/30 backdrop-blur-sm"
      >
        <span className="font-cormorant text-6xl text-[#C9B194] opacity-40 block mb-4">
          感謝
        </span>
        <h1 className="font-cormorant text-3xl text-[#706D54] uppercase tracking-widest mb-6">
          Pedido Confirmado
        </h1>
        <p className="font-inter text-sm text-[#706D54]/70 mb-10 leading-relaxed">
          Ricardo ha recibido la notificación. Tu obra de Mokuzai Art está
          siendo preparada para el envío.
        </p>
        <Link
          href={`/${lang}/coleccion`}
          className="inline-block px-8 py-4 bg-[#706D54] text-white font-inter text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-[#5a5743]"
        >
          Volver a la Galería
        </Link>
      </motion.div>
    </div>
  );
}
