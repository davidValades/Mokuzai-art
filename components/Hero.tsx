"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero({
  data,
  dict,
  lang,
}: {
  data: any;
  dict: any;
  lang: string;
}) {
  // Extraemos la traducción desde Sanity, si no hay, usamos nuestro diccionario local como red de seguridad
  const t = data?.translations?.[lang] || data?.translations?.es || {};

  const subtitle =
    t.subtitle || dict?.home?.subtitle || "Craftsmanship & Dedication";
  const mainTitle = t.mainTitle || "Mokuzai Art";
  const tagline = t.tagline || dict?.home?.tagline || "El alma de la madera.";

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#706D54]">
      <div className="absolute inset-0 z-0">
        {/* Imagen Horizontal (Desktop) */}
        <div className="hidden landscape:block h-full w-full">
          {data?.landscapeImage && (
            <Image
              src={data.landscapeImage}
              alt="Mokuzai Art - Vista Horizontal"
              fill
              priority
              className="object-cover object-bottom scale-105"
            />
          )}
        </div>

        {/* Imagen Vertical (Móvil) */}
        <div className="block landscape:hidden h-full w-full">
          {data?.mobileImage && (
            <Image
              src={data.mobileImage}
              alt="Mokuzai Art - Vista Vertical"
              fill
              priority
              className="object-cover object-center"
            />
          )}
        </div>

        {/* Filtros de Atmósfera Profunda */}
        <div className="absolute inset-0 bg-[#706D54]/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70"></div>
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="block font-inter text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#DBDBDB]/80 mb-6"
        >
          {subtitle}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="font-cormorant text-6xl md:text-8xl lg:text-9xl text-[#DBDBDB] leading-tight"
        >
          {mainTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-6 font-cormorant text-xl md:text-2xl italic text-[#DBDBDB]/90"
        >
          {tagline}
        </motion.p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50">
        <div className="w-[1px] h-16 bg-[#DBDBDB] animate-pulse"></div>
      </div>
    </section>
  );
}
