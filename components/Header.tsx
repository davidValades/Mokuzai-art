"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation"; // NUEVO: Para saber en qué página estamos
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const LANGUAGES = ["ES", "EN", "EU", "CA", "DE"];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLang, setCurrentLang] = useState("ES");
  
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("openCartDrawer", handleOpenCart);
    return () => window.removeEventListener("openCartDrawer", handleOpenCart);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        audioRef.current.volume = 0.2;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const headerHeight = useTransform(scrollY, [0, 100], ["100px", "70px"]);
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(219, 219, 219, 0)", "rgba(219, 219, 219, 0.95)"]);

  // NUEVA LÓGICA DE COLOR: Identificamos si la página tiene foto oscura arriba
  const isDarkHeroPage = pathname === "/" || pathname === "/el-taller" || pathname?.startsWith("/producto/");
  
  // Si no es una página con foto oscura, el texto empieza oscuro por defecto
  const textColor = isScrolled || isOpen || !isDarkHeroPage ? "text-[#706D54]" : "text-[#DBDBDB]";
  const lineColor = isScrolled || isOpen || !isDarkHeroPage ? "bg-[#706D54]" : "bg-[#DBDBDB]";

  const { cartCount } = useCart(); 

  const navItems = [
    { name: "Colección", path: "/coleccion" },
    { name: "El Taller", path: "/el-taller" },
    { name: "Contacto", path: "/contacto" }
  ];

  return (
    <>
      <audio ref={audioRef} loop src="/mokuzai-ambient.mp3" preload="auto" />

      <motion.header
        style={{ height: headerHeight, backgroundColor: headerBg }}
        className="fixed top-0 left-0 w-full z-[60] flex items-center justify-between px-8 md:px-16 transition-all duration-500 ease-in-out backdrop-blur-sm"
      >
        <Link href="/" className="z-50" onClick={() => setIsOpen(false)}>
          <h1 className={`font-cormorant text-2xl md:text-3xl tracking-widest uppercase transition-colors duration-500 ${textColor}`}>
            Mokuzai Art
          </h1>
        </Link>

        <div className="flex items-center space-x-6 md:space-x-8 z-50">
          
          {/* Atmósfera Sonora */}
          <button 
            onClick={toggleAudio}
            className={`hidden md:flex items-center gap-2 transition-colors duration-500 hover:opacity-50 ${textColor}`}
            aria-label="Toggle atmosphere"
          >
            <div className="flex items-end gap-[2px] h-3">
              <motion.div animate={{ height: isPlaying ? ["4px", "10px", "4px"] : "4px" }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className={`w-[2px] ${lineColor}`}></motion.div>
              <motion.div animate={{ height: isPlaying ? ["8px", "4px", "8px"] : "4px" }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className={`w-[2px] ${lineColor}`}></motion.div>
              <motion.div animate={{ height: isPlaying ? ["6px", "12px", "6px"] : "4px" }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className={`w-[2px] ${lineColor}`}></motion.div>
            </div>
          </button>

          {/* Idioma */}
          <div className="hidden md:flex items-center gap-2 group relative">
            <span className={`font-inter text-[10px] tracking-widest cursor-pointer transition-colors duration-500 ${textColor}`}>
              {currentLang}
            </span>
            <div className="absolute top-full left-0 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
              <div className="flex flex-col bg-[#DBDBDB] shadow-lg border border-[#706D54]/10 py-2">
                {LANGUAGES.map(lang => (
                  <button 
                    key={lang} 
                    onClick={() => setCurrentLang(lang)}
                    className="px-4 py-2 text-left font-inter text-[10px] tracking-widest text-[#706D54] hover:bg-[#706D54]/5 transition-colors"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8 lg:space-x-12 border-l border-current/20 pl-6 md:pl-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.path} className={`font-inter text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors duration-500 hover:opacity-50 ${textColor}`}>
                {item.name}
              </Link>
            ))}
          </nav>

          <button onClick={() => setIsCartOpen(true)} className={`relative transition-colors duration-500 hover:opacity-50 ${textColor} ml-4`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#A08963]" />}
          </button>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden relative w-7 h-3 focus:outline-none flex flex-col justify-between">
            <span className={`absolute left-0 w-full h-[1px] transition-all duration-500 origin-center ${lineColor} ${isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 w-full h-[1px] transition-all duration-500 origin-center ${lineColor} ${isOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 bg-[#DBDBDB] flex flex-col items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-10">
              {navItems.map((item, index) => (
                <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}>
                  <Link href={item.path} onClick={() => setIsOpen(false)} className="font-cormorant text-4xl tracking-widest text-[#706D54] uppercase hover:opacity-60 transition-opacity">
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="absolute bottom-16 w-[1px] h-12 bg-[#706D54]/30" />
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}