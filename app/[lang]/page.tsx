"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CollectionsGrid from "@/components/CollectionsGrid";

export default function Home() {
  return (
    <div className="relative w-full">
      {/* HERO SECTION (Atmósfera Profunda) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-olive-dark">
        <div className="absolute inset-0 z-0">
          <div className="hidden landscape:block h-full w-full">
            <Image
              src="/mokuzai-estilo-vida-jardin-zen-miniatura.webp" 
              alt="Jardín Zen Mokuzai Art - Vista Horizontal"
              fill
              priority
              className="object-cover object-bottom scale-105"
            />
          </div>
          <div className="block landscape:hidden h-full w-full">
            <Image
              src="/mokuzai-jardin-zen-frontal.webp" 
              alt="Jardín Zen Mokuzai Art - Vista Vertical"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-olive-dark/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="block font-inter text-[10px] md:text-xs tracking-[0.4em] uppercase text-stone-serene/80 mb-6"
          >
            Craftsmanship & Dedication
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="font-cormorant text-6xl md:text-8xl lg:text-9xl text-stone-serene leading-tight"
          >
            Mokuzai Art
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="mt-6 font-cormorant text-xl md:text-2xl italic text-stone-serene/90"
          >
            El alma de la madera.
          </motion.p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50">
          <div className="w-[1px] h-16 bg-stone-serene animate-pulse"></div>
        </div>
      </section>

      {/* NUEVO: GRID DE COLECCIONES */}
      <CollectionsGrid />
    </div>
  );
}