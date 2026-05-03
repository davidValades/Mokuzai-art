"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useCart } from "@/context/CartContext";

interface SanityImage {
  url: string;
  hotspot?: { x: number; y: number };
}

function getObjectPosition(hotspot?: { x: number; y: number }): string {
  if (!hotspot) return "50% 50%";
  return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
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
  const [selectedImage, setSelectedImage] = useState<SanityImage>(
    translatedProduct.image
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { addToCart } = useCart();
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 1000], [0, 300]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowFloatingBar(latest > 400);
  });

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightboxOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox]);

  // Build thumbnail list: main image first, then additional images
  const allImages: SanityImage[] = [
    translatedProduct.image,
    ...(translatedProduct.additionalImages ?? []),
  ].filter((img: SanityImage) => img?.url);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        id: translatedProduct.slug,
        name: translatedProduct.name,
        price: translatedProduct.price,
        image: translatedProduct.image?.url,
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
      image: translatedProduct.image?.url,
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
          className="absolute inset-0 w-full h-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main / selected image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={selectedImage.url}
                alt={translatedProduct.name}
                fill
                priority
                className={`object-cover transition-opacity duration-[1500ms] ease-in-out ${
                  isHovered && translatedProduct.hoverImage?.url
                    ? "opacity-0"
                    : "opacity-100"
                }`}
                style={{
                  objectPosition: getObjectPosition(selectedImage.hotspot),
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Hover / night image */}
          {translatedProduct.hoverImage?.url && (
            <Image
              src={translatedProduct.hoverImage.url}
              alt={`${translatedProduct.name} iluminado`}
              fill
              className={`object-cover absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{
                objectPosition: getObjectPosition(
                  translatedProduct.hoverImage.hotspot
                ),
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Zoom button */}
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Ver en detalle"
            className="absolute top-6 right-6 z-10 bg-black/30 hover:bg-black/50 transition-colors text-white p-2 backdrop-blur-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="square"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-2 4l4 4"
              />
            </svg>
          </button>

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

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                aria-label={`Ver foto ${idx + 1}`}
                className={`relative w-12 h-12 md:w-16 md:h-16 overflow-hidden border-2 transition-all duration-300 ${
                  selectedImage.url === img.url
                    ? "border-[#DBDBDB] opacity-100"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Miniatura ${idx + 1}`}
                  fill
                  className="object-cover"
                  style={{ objectPosition: getObjectPosition(img.hotspot) }}
                />
              </button>
            ))}
          </div>
        )}
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
            &ldquo;{translatedProduct.description}&rdquo;
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
            {translatedProduct.name}
          </span>
          <span className="font-inter text-xs text-[#A08963]">
            {translatedProduct.price} €
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

      {/* 4. LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto my-auto p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.url}
                  alt={translatedProduct.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            </motion.div>

            <button
              onClick={closeLightbox}
              aria-label="Cerrar"
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="square"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Thumbnail strip in lightbox */}
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(img);
                    }}
                    aria-label={`Ver foto ${idx + 1}`}
                    className={`relative w-14 h-14 overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage.url === img.url
                        ? "border-white opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getObjectPosition(img.hotspot) }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
