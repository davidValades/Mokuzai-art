"use client";

import { use } from "react";
import ProductCard, { Product } from "@/components/ProductCard";
import { motion } from "framer-motion";

// Simulamos nuestra base de datos con tus fotografías reales
const MOCK_PRODUCTS: Record<string, Product[]> = {
  meisho: [
    {
      id: "m1",
      slug: "lampara-andon",
      name: "Lámpara Tradicional Andon",
      category: "Iluminación / Shoji",
      price: 180,
      image: "/collections/meisho/mokuzai-meisho-lampara-andon-shoji-kanji.webp",
      hoverImage: "/collections/meisho/mokuzai-meisho-lampara-andon-shoji-kanji-oscura.webp",
    },
    {
      id: "m2",
      slug: "farol-komorebi",
      name: "Farol Komorebi",
      category: "Iluminación / Shoji",
      price: 145,
      image: "/collections/meisho/mokuzai-meisho-farol-madera-luz-calida.webp",
      hoverImage: "/collections/meisho/mokuzai-meisho-farol-madera-luz-calida-oscura.webp", // ¡Aquí está la magia!
    },
    {
      id: "m3",
      slug: "santuario-jiin",
      name: "Santuario Jiin",
      category: "Arquitectura / Maqueta",
      price: 320,
      image: "/collections/meisho/mokuzai-meisho-machiya-madera-artesanal.webp",
    },
    {
      id: "m4",
      slug: "portico-torii",
      name: "Pórtico Torii Sagrado",
      category: "Arquitectura",
      price: 85,
      image: "/collections/meisho/mokuzai-meisho-tori-jardin-arena.webp",
    }
  ],
  shokutaku: [
    {
      id: "s1",
      slug: "estuche-ceremonial-chado",
      name: "Estuche Ceremonial Chado",
      category: "Ritual / Té",
      price: 120,
      image: "/collections/shokutaku/mokuzai-shokutaku-estuche-ceremonia-matcha-madera.webp",
    },
    {
      id: "s2",
      slug: "set-degustacion-yoru",
      name: "Set de Degustación Yoru",
      category: "Mesa / Apilable",
      price: 150,
      image: "/collections/shokutaku/mokuzai-shokutaku-caja-apilable-cuencos-palillos-shoji.webp",
    },
    {
      id: "s3",
      slug: "cofre-culinario-koyo",
      name: "Cofre Culinario Kōyō",
      category: "Mesa / Organizador",
      price: 110,
      image: "/collections/shokutaku/mokuzai-shokutaku-organizador-madera-cuencos-sushi.webp",
    }
  ],
  budo: [
    {
      id: "b1",
      slug: "estuche-honor-kuro-obi",
      name: "Estuche de Honor Kuro-obi",
      category: "Artes Marciales",
      price: 95,
      image: "/collections/budo/mokuzai-budo-estuche-madera-cinturon-negro-karate-grabado.webp",
    },
    {
      id: "b2",
      slug: "estuche-disciplina-aka-obi",
      name: "Estuche Aka-obi",
      category: "Artes Marciales",
      price: 85,
      image: "/collections/budo/mokuzai-budo-estuche-madera-cinturon-rojo-karate-sin-grabado.webp",
    }
  ]
};

const COLLECTION_INFO: Record<string, { title: string; kanji: string; desc: string }> = {
  meisho: { title: "Meisho", kanji: "名所", desc: "El espacio para la contemplación." },
  shokutaku: { title: "Shokutaku", kanji: "食卓", desc: "La elegancia en lo cotidiano." },
  budo: { title: "Budō", kanji: "武道", desc: "El honor custodiado en madera." },
};

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  // En Next.js 15+, params es una promesa que debemos resolver
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const products = MOCK_PRODUCTS[id] || [];
  const info = COLLECTION_INFO[id] || { title: "Colección", kanji: "", desc: "Descubre nuestras obras." };

  return (
    <div className="min-h-screen bg-[#DBDBDB] pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera de la Galería */}
        <div className="mb-16 border-b border-[#706D54]/20 pb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="font-cormorant text-6xl text-[#C9B194] opacity-50 block mb-2"
            >
              {info.kanji}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
              className="font-cormorant text-5xl md:text-7xl text-[#706D54] uppercase tracking-wide"
            >
              {info.title}
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="font-inter text-sm md:text-base text-[#706D54]/80 max-w-md"
          >
            {info.desc}
          </motion.p>
        </div>

        {/* Grid de Productos (Tarjetas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mensaje de vacío (por si acaso) */}
        {products.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-cormorant text-2xl text-[#706D54]/60 italic">Nuevas obras están siendo talladas en el taller...</p>
          </div>
        )}
      </div>
    </div>
  );
}