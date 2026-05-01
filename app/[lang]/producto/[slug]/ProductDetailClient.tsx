"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useCart } from "@/context/CartContext";

// Definimos la estructura exacta que nos llega del servidor
interface ProductType {
  slug: string;
  name: string;
  kanji: string;
  category: string;
  description: string;
  details: string[];
  price: number;
  image: string;
  hoverImage?: string;
}

export default function ProductDetailClient({
  product,
  dict,
  lang,
}: {
  product: any;
  dict: any;
  lang: string;
}) {
  const t = product.translations?.[lang] || product.translations?.es || {};
  const translatedProduct = {
    ...product,
    name: t.name || product.internalName,
    description: t.description || "",
    details: t.details || [],
  };
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  const { addToCart } = useCart();
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 1000], [0, 300]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowFloatingBar(latest > 400);
  });

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        id: translatedProduct.slug,
        name: translatedProduct.name,
        price: translatedProduct.price,
        image: translatedProduct.image,
        quantity: 1,
      });
      setIsAdding(false);
      window.dispatchEvent(new CustomEvent("openCartDrawer"));
    }, 800);
  };

  const handleDirectBuy = () => {
    addToCart({
      id: translatedProduct.slug,
      name: translatedProduct.name,
      price: translatedProduct.price,
      image: translatedProduct.image,
      quantity: 1,
    });
    alert(`Iniciando adquisición directa de: ${translatedProduct.name}`);
  };

  return (
    <div className="min-h-screen bg-[#DBDBDB] relative pb-24">
      {/* 1. SECCIÓN HERO */}
      <div className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-[#706D54]">
        <motion.div
          style={{ y: yImage }}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={translatedProduct.image}
            alt={translatedProduct.name}
            fill
            priority
            className={`object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${
              isHovered && translatedProduct.hoverImage
                ? "opacity-0"
                : "opacity-100"
            }`}
          />
          {translatedProduct.hoverImage && (
            <Image
              src={translatedProduct.hoverImage}
              alt={`${translatedProduct.name} iluminado`}
              fill
              className={`object-cover object-center absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-12 left-0 w-full flex justify-center pointer-events-none"
          >
            <span className="font-cormorant text-8xl md:text-[12rem] text-[#DBDBDB]/80 block leading-none tracking-widest drop-shadow-lg">
              {product.kanji}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. SECCIÓN DE CONTENIDO */}
      <div className="relative z-10 bg-[#DBDBDB] pt-24 pb-32 px-6 md:px-16 w-full flex justify-center shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
        <div className="max-w-3xl w-full">
          <div className="flex justify-between items-center mb-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-3 text-[#706D54]/60 hover:text-[#706D54] transition-colors group cursor-pointer"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth="1.5"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-inter text-[10px] tracking-[0.3em] uppercase">
                {dict.product?.back || "Volver"}
              </span>
            </button>
            <nav className="font-inter text-[10px] tracking-[0.3em] uppercase text-[#706D54]/50 flex space-x-2">
              <span>{dict.navigation?.collection || "Colección"}</span>
              <span>/</span>
              <span className="text-[#A08963]">
                {translatedProduct.category}
              </span>
            </nav>
          </div>

          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-cormorant text-5xl md:text-7xl text-[#706D54] mb-6 leading-tight"
            >
              {translatedProduct.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1 }}
              className="font-inter text-xl text-[#706D54] tracking-widest"
            >
              {translatedProduct.price} €
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-cormorant text-2xl md:text-3xl text-center italic text-[#706D54]/90 mb-20 leading-relaxed"
          >
            "{translatedProduct.description}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mb-20 flex flex-col items-center"
          >
            <h4 className="font-inter text-xs tracking-widest uppercase text-[#706D54] mb-8 text-center border-b border-[#A08963]/30 pb-4 inline-block">
              {dict.product?.specs || "Especificaciones de la Obra"}
            </h4>
            <ul className="space-y-4 text-center">
              {translatedProduct.details.map((detail: string, idx: number) => (
                <li
                  key={idx}
                  className="font-inter text-base text-[#706D54]/80"
                >
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* 3. BARRA FLOTANTE */}
      <motion.div
        animate={{ y: showFloatingBar ? 0 : 150 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 w-full bg-[#DBDBDB]/95 backdrop-blur-md border-t border-[#706D54]/10 z-50 flex items-center justify-between px-6 md:px-16 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
      >
        <div className="hidden md:flex flex-col">
          <span className="font-cormorant text-2xl text-[#706D54]">
            {product.name}
          </span>
          <span className="font-inter text-xs text-[#A08963]">
            {product.price} €
          </span>
        </div>

        <div className="w-full md:w-auto flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 md:flex-none px-8 py-3 border border-[#706D54] text-[#706D54] font-inter text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${
              isAdding ? "bg-[#706D54]/10" : "hover:bg-[#706D54]/5"
            }`}
          >
            {isAdding
              ? dict.product?.adding || "Custodiando..."
              : dict.product?.add_to_cart || "Añadir a la Cesta"}
          </button>
          <button
            onClick={handleDirectBuy}
            className="flex-1 md:flex-none px-8 py-3 bg-[#706D54] text-[#DBDBDB] font-inter text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#5a5743]"
          >
            {dict.product?.buy_now || "Adquirir"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
