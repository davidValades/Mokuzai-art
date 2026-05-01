"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

// Base de datos completa
const MOCK_DB = [
  // COLECCIÓN MEISHO
  {
    slug: "lampara-andon", name: "Lámpara Tradicional Andon", kanji: "行灯", category: "Meisho", price: 180,
    description: "Una pieza que evoca la calidez de las antiguas posadas japonesas. Su estructura de pino, ensamblada con precisión geométrica, custodia la luz filtrada a través de paneles traslúcidos. Los caracteres caligrafiados invitan a la serenidad y al reposo.",
    details: ["Madera de pino silvestre", "Paneles difusores efecto papel de arroz", "Iluminación cálida LED", "Ensamblaje artesanal"],
    image: "/collections/meisho/mokuzai-meisho-lampara-andon-shoji-kanji.webp",
    hoverImage: "/collections/meisho/mokuzai-meisho-lampara-andon-shoji-kanji-oscura.webp",
  },
  {
    slug: "farol-komorebi", name: "Farol Komorebi", kanji: "木漏れ日", category: "Meisho", price: 145,
    description: "Komorebi es la palabra japonesa para la luz del sol que se filtra a través de las hojas de los árboles. Esta celosía diagonal de madera captura esa misma esencia, proyectando sombras orgánicas que transforman cualquier espacio en un refugio de paz.",
    details: ["Madera de pino tratada", "Celosía asimétrica estilo Kumiko", "Bisagras de latón envejecido", "Acabado al aceite natural"],
    image: "/collections/meisho/mokuzai-meisho-farol-madera-luz-calida.webp",
    hoverImage: "/collections/meisho/mokuzai-meisho-farol-madera-luz-calida-oscura.webp",
  },
  {
    slug: "santuario-jiin", name: "Santuario Jiin", kanji: "寺院", category: "Meisho", price: 320,
    description: "La devoción tallada en madera. Una réplica a escala íntima de la arquitectura sagrada japonesa. Cada viga y cada teja han sido trabajadas a mano, creando un espacio de contemplación silenciosa.",
    details: ["Madera natural", "Tejado meticulosamente tallado", "Técnicas de ensamblaje tradicional"],
    image: "/collections/meisho/mokuzai-meisho-machiya-madera-artesanal.webp",
  },
  {
    slug: "portico-torii", name: "Pórtico Torii Sagrado", kanji: "鳥居", category: "Meisho", price: 85,
    description: "La puerta entre lo profano y lo sagrado. Un diseño minimalista que invita a la transición, al respeto y a dejar atrás las preocupaciones del mundo exterior antes de entrar en tu espacio personal.",
    details: ["Proporciones armónicas", "Base estable", "Acabado mate aterciopelado"],
    image: "/collections/meisho/mokuzai-meisho-tori-jardin-arena.webp",
  },

  // COLECCIÓN SHOKUTAKU
  {
    slug: "estuche-ceremonial-chado", name: "Estuche Ceremonial Chado", kanji: "茶道", category: "Shokutaku", price: 120,
    description: "El Camino del Té requiere de utensilios dignos. Este estuche organiza y venera tus cuencos, tu batidor de bambú (chasen) y tu recipiente para el té matcha, elevando la ceremonia a su máxima expresión.",
    details: ["Madera noble pulida", "Compartimentos modulares", "Tapa forrada con motivos tradicionales"],
    image: "/collections/shokutaku/mokuzai-shokutaku-estuche-ceremonia-matcha-madera.webp",
  },
  {
    slug: "set-degustacion-yoru", name: "Set de Degustación Yoru", kanji: "夜", category: "Shokutaku", price: 150,
    description: "La elegancia de la noche plasmada en una caja apilable y estructurada. Ideal para organizar cuencos de cerámica y palillos premium, transformando una cena en una experiencia sensorial.",
    details: ["Diseño arquitectónico apilable", "Tapa oscura con patrón floral dorado", "Compartimento especial para palillos"],
    image: "/collections/shokutaku/mokuzai-shokutaku-caja-apilable-cuencos-palillos-shoji.webp",
  },
  {
    slug: "cofre-culinario-koyo", name: "Cofre Culinario Kōyō", kanji: "紅葉", category: "Shokutaku", price: 110,
    description: "Inspirado en los colores de las hojas de otoño. Este cofre abierto presenta tus palillos y pequeños cuencos para salsas con una armonía asimétrica que deleita a la vista antes que al paladar.",
    details: ["Estructura robusta pero visualmente ligera", "Fondo interior protector", "Madera de tacto sedoso"],
    image: "/collections/shokutaku/mokuzai-shokutaku-organizador-madera-cuencos-sushi.webp",
  },

  // COLECCIÓN BUDŌ
  {
    slug: "estuche-honor-kuro-obi", name: "Estuche de Honor Kuro-obi", kanji: "黒帯", category: "Budō", price: 95,
    description: "El cinturón negro no es un destino, es el comienzo del verdadero camino. Este estuche, tallado con sobriedad y respeto, está diseñado para custodiar años de sudor, disciplina y honor marcial. Personalizado con la técnica del grabado profundo.",
    details: ["Madera maciza tratada", "Interior forrado en tela con motivos tradicionales", "Grabado de nombre y disciplina", "Cierre de precisión"],
    image: "/collections/budo/mokuzai-budo-estuche-madera-cinturon-negro-karate-grabado.webp",
  },
  {
    slug: "estuche-disciplina-aka-obi", name: "Estuche Aka-obi", kanji: "赤帯", category: "Budō", price: 85,
    description: "Custodia la pasión y la intensidad de tu aprendizaje marcial. Un estuche limpio, puro, sin grabados externos, donde la veta de la madera habla por sí misma y protege tu herramienta de progreso.",
    details: ["Pino natural", "Ensambles reforzados", "Interior forrado"],
    image: "/collections/budo/mokuzai-budo-estuche-madera-cinturon-rojo-karate-sin-grabado.webp",
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const router = useRouter();
  
  const product = MOCK_DB.find((p) => p.slug === slug);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Efecto Parallax suave para la imagen de cabecera
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 1000], [0, 300]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#DBDBDB] flex flex-col items-center justify-center">
        <h1 className="font-cormorant text-4xl text-[#706D54]">La obra no ha sido encontrada.</h1>
        <button onClick={() => router.back()} className="mt-6 font-inter text-sm tracking-widest text-[#A08963] uppercase border-b border-[#A08963] pb-1">
          Volver a la galería
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      alert(`La obra ${product.name} ha sido guardada en tu selección.`); 
    }, 800);
  };

  const handleDirectBuy = () => {
    alert(`Iniciando adquisición directa de: ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-[#DBDBDB] relative">
      
      {/* 1. SECCIÓN HERO (La Obra a pantalla completa) */}
      <div className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-[#706D54]">
        <motion.div 
          style={{ y: yImage }}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className={`object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${
              isHovered && product.hoverImage ? "opacity-0" : "opacity-100"
            }`}
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={`${product.name} iluminado`}
              fill
              className={`object-cover object-center absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          
          {/* ELIMINADO: El gradiente a blanco. 
              NUEVO: Un degradado sutil de negro a negro oscuro solo para proteger el contraste del Kanji, sin emborronar la foto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
          
          {/* Kanji flotante */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-12 left-0 w-full flex justify-center pointer-events-none"
          >
            <span className="font-cormorant text-8xl md:text-[12rem] text-[#DBDBDB]/80 block leading-none tracking-widest drop-shadow-lg">
              {product.kanji}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. SECCIÓN DE CONTENIDO (Entra con un corte arquitectónico limpio) */}
      <div className="relative z-10 bg-[#DBDBDB] pt-24 pb-32 px-6 md:px-16 w-full flex justify-center shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
        <div className="max-w-3xl w-full">
          
          {/* Botón de Retorno y Breadcrumbs */}
          <div className="flex justify-between items-center mb-16">
            <button 
              onClick={() => router.back()} 
              className="flex items-center space-x-3 text-[#706D54]/60 hover:text-[#706D54] transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-inter text-[10px] tracking-[0.3em] uppercase">Volver</span>
            </button>

            <nav className="font-inter text-[10px] tracking-[0.3em] uppercase text-[#706D54]/50 flex space-x-2">
              <span>Colección</span>
              <span>/</span>
              <span className="text-[#A08963]">{product.category}</span>
            </nav>
          </div>

          {/* Título y Precio */}
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="font-cormorant text-5xl md:text-7xl text-[#706D54] mb-6 leading-tight"
            >
              {product.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 1 }}
              className="font-inter text-xl text-[#706D54] tracking-widest"
            >
              {product.price} €
            </motion.p>
          </div>

          {/* Descripción */}
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 1 }}
            className="font-cormorant text-2xl md:text-3xl text-center italic text-[#706D54]/90 mb-20 leading-relaxed"
          >
            "{product.description}"
          </motion.p>

          {/* Especificaciones */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 1 }} className="mb-20 flex flex-col items-center">
            <h4 className="font-inter text-xs tracking-widest uppercase text-[#706D54] mb-8 text-center border-b border-[#A08963]/30 pb-4 inline-block">
              Especificaciones de la Obra
            </h4>
            <ul className="space-y-4 text-center">
              {product.details.map((detail, idx) => (
                <li key={idx} className="font-inter text-base text-[#706D54]/80">
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Botones de Acción */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full sm:w-64 py-5 border border-[#706D54] text-[#706D54] font-inter text-xs tracking-[0.2em] uppercase transition-all duration-500 flex justify-center items-center ${
                isAdding ? "bg-[#706D54]/10" : "hover:bg-[#706D54]/5"
              }`}
            >
              {isAdding ? "Añadiendo..." : "Añadir a la Cesta"}
            </button>

            <button
              onClick={handleDirectBuy}
              className="w-full sm:w-64 py-5 bg-[#706D54] text-[#DBDBDB] font-inter text-xs tracking-[0.2em] uppercase transition-all duration-500 flex justify-center items-center hover:bg-[#5a5743]"
            >
              Adquisición Directa
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}