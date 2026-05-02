"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CollectionDetailClient({
  collection,
  dict,
  lang,
}: any) {
  // Blindamos la extracción de traducciones
  const t =
    collection?.translations?.[lang] || collection?.translations?.es || {};

  return (
    <div className="px-8 md:px-16 pb-32 pt-32">
      {/* Botón Volver */}
      <Link
        href={`/${lang}/coleccion`}
        className="mb-12 inline-flex items-center gap-2 text-[#706D54]/50 hover:text-[#706D54] transition-colors group"
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">
          ←
        </span>
        <span className="font-inter text-[10px] tracking-widest uppercase">
          {lang === "es" ? "Galería Completa" : "Full Gallery"}
        </span>
      </Link>

      <div className="text-center mb-16">
        {/* Blindamos el acceso a kanji con el interrogante[cite: 3] */}
        <span className="font-cormorant text-5xl text-[#C9B194] opacity-40 block mb-2">
          {collection?.kanji}
        </span>
        <h1 className="font-cormorant text-4xl md:text-6xl text-[#706D54] mb-6 uppercase tracking-widest">
          {t?.title}
        </h1>
        <p className="font-inter text-sm text-[#706D54]/60 max-w-2xl mx-auto tracking-wide">
          {t?.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {/* Usamos el interrogante también en el mapeo de productos[cite: 3] */}
        {collection?.products?.map((art: any) => {
          const pt = art?.translations?.[lang] || art?.translations?.es || {};
          return (
            <motion.div
              key={art?.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Link href={`/${lang}/producto/${art?.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#C9B194]/10 mb-8">
                  {art?.image && (
                    <Image
                      src={art.image}
                      alt={pt?.name || "Obra"}
                      fill
                      className="object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                    />
                  )}
                  {art?.hoverImage && (
                    <Image
                      src={art.hoverImage}
                      fill
                      alt="Hover"
                      className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms]"
                    />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-cormorant text-2xl text-[#706D54] mb-2">
                    {pt?.name}
                  </h3>
                  <p className="font-inter text-[11px] tracking-widest text-[#706D54]/60">
                    {art?.price} €
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Estado vacío por si no hay productos vinculados aún */}
      {(!collection?.products || collection?.products?.length === 0) && (
        <div className="text-center py-20">
          <p className="font-cormorant text-xl text-[#706D54]/40 italic">
            Nuevas obras están siendo talladas en el taller...
          </p>
        </div>
      )}
    </div>
  );
}
