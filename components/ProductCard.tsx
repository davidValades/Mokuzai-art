import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Definimos la estructura de datos de nuestra obra
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  hoverImage?: string; // Opcional, para el efecto día/noche
}

export default function ProductCard({ product, index, lang = "es" }: { product: Product; index: number; lang?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col group cursor-pointer"
    >
      <Link href={`/${lang}/producto/${product.slug}`} className="block relative w-full aspect-[3/4] overflow-hidden bg-[#DBDBDB]/30 mb-6">
        {/* Imagen Secundaria (Noche / Detalle) - Al fondo */}
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt={`${product.name} iluminado o detalle`}
            fill
            className="object-cover object-center scale-105"
          />
        )}
        
        {/* Imagen Principal (Día) - Al frente */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover object-center transition-all duration-[1000ms] ease-in-out scale-100 group-hover:scale-105 ${
            product.hoverImage ? "group-hover:opacity-0 z-10" : ""
          }`}
        />
      </Link>

      {/* Metadatos de la Obra */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <Link href={`/${lang}/producto/${product.slug}`}>
            <h3 className="font-cormorant text-2xl text-[#706D54] transition-colors duration-300 group-hover:opacity-70">
              {product.name}
            </h3>
          </Link>
          <span className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#A08963] mt-1">
            {product.category}
          </span>
        </div>
        <span className="font-inter text-sm text-[#706D54]">
          {product.price} €
        </span>
      </div>
    </motion.div>
  );
}