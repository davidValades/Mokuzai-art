"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NotFound() {
  const params = useParams();
  const lang = (params?.lang as string) || "es";

  return (
    <main className="min-h-screen bg-[#DBDBDB] flex flex-col items-center justify-center px-6 text-center">
      {/* Kanji decorativo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
        className="absolute select-none font-cormorant text-[30vw] leading-none text-[#706D54] pointer-events-none"
      >
        迷
      </motion.div>

      <div className="relative z-10 max-w-lg">
        {/* Número 404 */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#A08963] mb-6"
        >
          Error 404
        </motion.p>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-cormorant text-5xl md:text-6xl tracking-widest uppercase text-[#706D54] mb-4"
        >
          Página no encontrada
        </motion.h1>

        {/* Separador */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-px bg-[#706D54]/30 mx-auto mb-6"
        />

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-inter text-xs tracking-wider text-[#706D54]/70 leading-relaxed mb-12"
        >
          Como la veta de la madera, cada camino es único. La página que buscas
          ya no existe o ha sido movida. Permítenos guiarte de vuelta a la
          galería.
        </motion.p>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={`/${lang}`}
            className="font-inter text-[10px] tracking-[0.2em] uppercase bg-[#706D54] text-[#DBDBDB] px-10 py-4 hover:bg-[#A08963] transition-colors duration-300"
          >
            Volver al inicio
          </Link>
          <Link
            href={`/${lang}/coleccion`}
            className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#706D54]/60 hover:text-[#706D54] transition-colors duration-300 border border-[#706D54]/30 px-10 py-4"
          >
            Ver la colección
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
