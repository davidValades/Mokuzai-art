"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Definimos nuestras colecciones maestras con las rutas reales
const collections = [
  {
    id: "meisho",
    title: "Meisho",
    kanji: "名所",
    description: "El espacio para la contemplación. Arquitectura en escala íntima.",
    image: "/collections/meisho/mokuzai-meisho-machiya-madera-artesanal.webp", 
    className: "md:col-span-8 h-[60vh] md:h-[70vh]",
  },
  {
    id: "shokutaku",
    title: "Shokutaku",
    kanji: "食卓",
    description: "La elegancia en lo cotidiano. El ritual de la mesa.",
    image: "/collections/shokutaku/mokuzai-shokutaku-estuche-ceremonia-matcha-madera.webp",
    className: "md:col-span-4 h-[50vh] md:h-[70vh]",
  },
  {
    id: "budo",
    title: "Budō",
    kanji: "武道",
    description: "El honor custodiado. Estuches para el camino del guerrero.",
    image: "/collections/budo/mokuzai-budo-estuche-madera-cinturon-negro-karate-grabado.webp",
    className: "md:col-span-12 h-[40vh] md:h-[50vh]",
  },
];

export default function CollectionsGrid() {
  return (
    <section className="w-full bg-stone-serene py-24 px-6 md:px-16">
      {/* Encabezado de la Sección */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-inter text-xs tracking-[0.3em] uppercase text-olive-dark/70 mb-4 block"
        >
          Nuestras Obras
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-cormorant text-4xl md:text-5xl text-olive-dark"
        >
          Colecciones Maestras
        </motion.h3>
      </div>

      {/* Grid Asimétrico (Bento Layout) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`relative group overflow-hidden bg-olive-dark ${collection.className}`}
          >
            <Link href={`/coleccion/${collection.id}`} className="absolute inset-0 z-20 w-full h-full">
              <span className="sr-only">Ver colección {collection.title}</span>
            </Link>

            {/* Imagen con zoom sutil (Lujo silencioso) */}
            <div className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-out group-hover:scale-105">
              <Image
                src={collection.image}
                alt={`Colección ${collection.title} de Mokuzai Art`}
                fill
                className="object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              />
            </div>

            {/* Overlay para garantizar legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-olive-dark/90 via-olive-dark/20 to-transparent"></div>

            {/* Contenido de texto en la esquina inferior */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10 w-full flex flex-col items-start">
              <span className="font-cormorant text-4xl text-wood-light mb-2 opacity-80">
                {collection.kanji}
              </span>
              <h4 className="font-cormorant text-3xl md:text-4xl text-stone-serene uppercase tracking-widest mb-3">
                {collection.title}
              </h4>
              <p className="font-inter text-sm md:text-base text-stone-serene/80 max-w-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {collection.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}