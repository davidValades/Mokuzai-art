"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Base de datos completa con todas las obras del taller
const MOCK_DB = [
  // COLECCIÓN MEISHO
  {
    slug: "lampara-andon",
    name: "Lámpara Tradicional Andon", kanji: "行灯", category: "Meisho", price: 180,
    description: "Una pieza que evoca la calidez de las antiguas posadas japonesas. Su estructura de pino, ensamblada con precisión geométrica, custodia la luz filtrada a través de paneles traslúcidos. Los caracteres caligrafiados invitan a la serenidad y al reposo.",
    details: ["Madera de pino silvestre", "Paneles difusores efecto papel de arroz", "Iluminación cálida LED", "Ensamblaje artesanal"],
    image: "/collections/meisho/mokuzai-meisho-lampara-andon-shoji-kanji.webp",
    hoverImage: "/collections/meisho/mokuzai-meisho-lampara-andon-shoji-kanji-oscura.webp",
  },
  {
    slug: "farol-komorebi",
    name: "Farol Komorebi", kanji: "木漏れ日", category: "Meisho", price: 145,
    description: "Komorebi es la palabra japonesa para la luz del sol que se filtra a través de las hojas de los árboles. Esta celosía diagonal de madera captura esa misma esencia, proyectando sombras orgánicas que transforman cualquier espacio en un refugio de paz.",
    details: ["Madera de pino tratada", "Celosía asimétrica estilo Kumiko", "Bisagras de latón envejecido", "Acabado al aceite natural"],
    image: "/collections/meisho/mokuzai-meisho-farol-madera-luz-calida.webp",
    hoverImage: "/collections/meisho/mokuzai-meisho-farol-madera-luz-calida-oscura.webp",
  },
  {
    slug: "santuario-jiin",
    name: "Santuario Jiin", kanji: "寺院", category: "Meisho", price: 320,
    description: "La devoción tallada en madera. Una réplica a escala íntima de la arquitectura sagrada japonesa. Cada viga y cada teja han sido trabajadas a mano, creando un espacio de contemplación silenciosa.",
    details: ["Madera natural", "Tejado meticulosamente tallado", "Técnicas de ensamblaje tradicional"],
    image: "/collections/meisho/mokuzai-meisho-machiya-madera-artesanal.webp",
  },
  {
    slug: "portico-torii",
    name: "Pórtico Torii Sagrado", kanji: "鳥居", category: "Meisho", price: 85,
    description: "La puerta entre lo profano y lo sagrado. Un diseño minimalista que invita a la transición, al respeto y a dejar atrás las preocupaciones del mundo exterior antes de entrar en tu espacio personal.",
    details: ["Proporciones armónicas", "Base estable", "Acabado mate aterciopelado"],
    image: "/collections/meisho/mokuzai-meisho-tori-jardin-arena.webp",
  },

  // COLECCIÓN SHOKUTAKU
  {
    slug: "estuche-ceremonial-chado",
    name: "Estuche Ceremonial Chado", kanji: "茶道", category: "Shokutaku", price: 120,
    description: "El Camino del Té requiere de utensilios dignos. Este estuche organiza y venera tus cuencos, tu batidor de bambú (chasen) y tu recipiente para el té matcha, elevando la ceremonia a su máxima expresión.",
    details: ["Madera noble pulida", "Compartimentos modulares", "Tapa forrada con motivos tradicionales"],
    image: "/collections/shokutaku/mokuzai-shokutaku-estuche-ceremonia-matcha-madera.webp",
  },
  {
    slug: "set-degustacion-yoru",
    name: "Set de Degustación Yoru", kanji: "夜", category: "Shokutaku", price: 150,
    description: "La elegancia de la noche plasmada en una caja apilable y estructurada. Ideal para organizar cuencos de cerámica y palillos premium, transformando una cena en una experiencia sensorial.",
    details: ["Diseño arquitectónico apilable", "Tapa oscura con patrón floral dorado", "Compartimento especial para palillos"],
    image: "/collections/shokutaku/mokuzai-shokutaku-caja-apilable-cuencos-palillos-shoji.webp",
  },
  {
    slug: "cofre-culinario-koyo",
    name: "Cofre Culinario Kōyō", kanji: "紅葉", category: "Shokutaku", price: 110,
    description: "Inspirado en los colores de las hojas de otoño. Este cofre abierto presenta tus palillos y pequeños cuencos para salsas con una armonía asimétrica que deleita a la vista antes que al paladar.",
    details: ["Estructura robusta pero visualmente ligera", "Fondo interior protector", "Madera de tacto sedoso"],
    image: "/collections/shokutaku/mokuzai-shokutaku-organizador-madera-cuencos-sushi.webp",
  },

  // COLECCIÓN BUDŌ
  {
    slug: "estuche-honor-kuro-obi",
    name: "Estuche de Honor Kuro-obi", kanji: "黒帯", category: "Budō", price: 95,
    description: "El cinturón negro no es un destino, es el comienzo del verdadero camino. Este estuche, tallado con sobriedad y respeto, está diseñado para custodiar años de sudor, disciplina y honor marcial. Personalizado con la técnica del grabado profundo.",
    details: ["Madera maciza tratada", "Interior forrado en tela con motivos tradicionales", "Grabado de nombre y disciplina", "Cierre de precisión"],
    image: "/collections/budo/mokuzai-budo-estuche-madera-cinturon-negro-karate-grabado.webp",
  },
  {
    slug: "estuche-disciplina-aka-obi",
    name: "Estuche Aka-obi", kanji: "赤帯", category: "Budō", price: 85,
    description: "Custodia la pasión y la intensidad de tu aprendizaje marcial. Un estuche limpio, puro, sin grabados externos, donde la veta de la madera habla por sí misma y protege tu herramienta de progreso.",
    details: ["Pino natural", "Ensambles reforzados", "Interior forrado"],
    image: "/collections/budo/mokuzai-budo-estuche-madera-cinturon-rojo-karate-sin-grabado.webp",
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const router = useRouter(); // NUEVO: Herramienta de navegación de Next.js
  
  const product = MOCK_DB.find((p) => p.slug === slug);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#DBDBDB] pt-24 md:pt-0">
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* LADO IZQUIERDO: La Galería Visual (Sticky) */}
        <div className="w-full md:w-1/2 relative h-[60vh] md:h-screen sticky top-0 bg-[#DBDBDB]">
          <div 
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
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 1 }}
              className="absolute bottom-12 left-12 md:bottom-24 md:left-16 pointer-events-none"
            >
              <span className="font-cormorant text-8xl md:text-9xl text-stone-serene/40 block leading-none">
                {product.kanji}
              </span>
            </motion.div>
          </div>
        </div>

        {/* LADO DERECHO: La Historia y la Adquisición */}
        <div className="w-full md:w-1/2 flex items-center p-8 md:p-16 lg:p-24 overflow-y-auto">
          <div className="max-w-md w-full">
            
            {/* NUEVO: Botón de Retorno Minimalista */}
            <button 
              onClick={() => router.back()} 
              className="mb-10 flex items-center space-x-3 text-[#706D54]/50 hover:text-[#706D54] transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-inter text-[10px] tracking-[0.3em] uppercase">Volver</span>
            </button>

            {/* Breadcrumbs de Lujo */}
            <nav className="mb-8 font-inter text-[10px] tracking-[0.3em] uppercase text-[#706D54]/50 flex space-x-2">
              <span>Colección</span>
              <span>/</span>
              <span className="text-[#A08963]">{product.category}</span>
            </nav>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="font-cormorant text-5xl md:text-6xl text-[#706D54] mb-6 leading-tight"
            >
              {product.name}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
              className="font-inter text-lg text-[#706D54] mb-10"
            >
              {product.price} €
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
              className="font-cormorant text-xl italic text-[#706D54]/80 mb-12 leading-relaxed"
            >
              "{product.description}"
            </motion.p>

            {/* Separador Orgánico */}
            <div className="w-12 h-[1px] bg-[#A08963]/30 mb-12"></div>

            {/* Detalles Técnicos */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
              <h4 className="font-inter text-xs tracking-widest uppercase text-[#706D54] mb-6">Especificaciones de la Obra</h4>
              <ul className="space-y-3 mb-16">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="font-inter text-sm text-[#706D54]/70 flex items-center">
                    <span className="w-1 h-1 rounded-full bg-[#A08963] mr-4 block"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Botón de Adquisición */}
            <motion.button
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-5 border border-[#706D54] text-[#706D54] font-inter text-xs tracking-[0.2em] uppercase transition-all duration-500 flex justify-center items-center ${
                isAdding ? "bg-[#706D54] text-[#DBDBDB]" : "hover:bg-[#706D54] hover:text-[#DBDBDB]"
              }`}
            >
              {isAdding ? "Custodiando..." : "Añadir a la colección"}
            </motion.button>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}