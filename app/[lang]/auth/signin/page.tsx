"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#DBDBDB] flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-[#706D54] selection:text-[#DBDBDB]">
      {/* Círculo decorativo sutil de fondo (Estética Zen) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] border border-[#706D54]/5 rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-md w-full relative z-10 flex flex-col items-center text-center"
      >
        <span className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#A08963] mb-6 block">
          Área Privada
        </span>

        <h1 className="font-cormorant text-5xl text-[#706D54] mb-4">
          Coleccionistas
        </h1>

        <p className="font-inter text-sm text-[#706D54]/70 mb-12 leading-relaxed">
          Accede a tu espacio personal para dar seguimiento a las obras que el
          tiempo y la madera están esculpiendo para ti.
        </p>

        {/* Botón de Login Estilo Mokuzai (Google) */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="group relative w-full flex items-center justify-center gap-4 py-4 px-8 border border-[#706D54] bg-transparent text-[#706D54] hover:bg-[#706D54] hover:text-[#DBDBDB] transition-all duration-500 overflow-hidden mb-4"
        >
          {/* ... (icono de Google) ... */}
          <span className="font-inter text-xs tracking-[0.2em] uppercase">
            Continuar con Google
          </span>
        </button>

        {/* BOTÓN TEMPORAL PARA PROBAR EL FLUJO SIN GOOGLE */}
        <button
          onClick={() => signIn("credentials", { callbackUrl: "/" })}
          className="group relative w-full flex items-center justify-center gap-4 py-4 px-8 border border-[#A08963] bg-transparent text-[#A08963] hover:bg-[#A08963] hover:text-[#DBDBDB] transition-all duration-500 overflow-hidden"
        >
          <span className="font-inter text-xs tracking-[0.2em] uppercase">
            Acceso de Prueba
          </span>
        </button>

        <div className="mt-12">
          <Link
            href="/"
            className="font-inter text-[10px] tracking-widest uppercase text-[#706D54]/50 hover:text-[#706D54] transition-colors border-b border-transparent hover:border-[#706D54]/30 pb-1"
          >
            Volver a la Galería
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
