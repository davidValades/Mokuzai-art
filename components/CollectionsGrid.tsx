"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Ahora recibimos los datos como propiedades (props)
export default function CollectionsGrid({
  collections,
  dict,
  lang,
}: {
  collections: any[];
  dict: any;
  lang: string;
}) {
  return (
    <section className="w-full bg-[#DBDBDB] py-24 px-6 md:px-16">
      {/* Encabezado de la Sección */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-inter text-xs tracking-[0.3em] uppercase text-[#706D54]/70 mb-4 block"
        >
          {dict.home.our_works}
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-cormorant text-4xl md:text-5xl text-[#706D54]"
        >
          {dict.home.master_collections}
        </motion.h3>
      </div>

      {/* Grid Asimétrico Dinámico */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {collections.map((collection, index) => {
          // Rescate de idioma (Fallback)
          const t =
            collection.translations?.[lang] ||
            collection.translations?.es ||
            {};

          return (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative group overflow-hidden bg-[#706D54] ${collection.layout}`}
            >
              <Link
                href={`/${lang}/coleccion/${collection.slug}`}
                className="absolute inset-0 z-20 w-full h-full"
              >
                <span className="sr-only">
                  {dict.home.view_collection} {t.title}
                </span>
              </Link>

              {/* Imagen desde Sanity (cdn.sanity.io) */}
              <div className="absolute inset-0 w-full h-full transition-transform duration-[2.5s] ease-out group-hover:scale-105">
                {collection.image && (
                  <Image
                    src={collection.image}
                    alt={`Colección ${t.title}`}
                    fill
                    className="object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                )}
              </div>

              {/* Overlay para garantizar legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Contenido de texto en la esquina inferior */}
              <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10 w-full flex flex-col items-start">
                <span className="font-cormorant text-4xl text-[#C9B194] mb-2 opacity-90 drop-shadow-lg">
                  {collection.kanji}
                </span>
                <h4 className="font-cormorant text-3xl md:text-4xl text-[#DBDBDB] uppercase tracking-widest mb-3">
                  {t.title}
                </h4>
                <p className="font-inter text-sm md:text-base text-[#DBDBDB]/80 max-w-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {t.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
