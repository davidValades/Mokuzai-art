"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Estado para controlar el carrito lateral (lo implementaremos después)
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const headerHeight = useTransform(scrollY, [0, 100], ["100px", "70px"]);
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(219, 219, 219, 0)", "rgba(219, 219, 219, 0.95)"]
  );

  const textColor = isScrolled || isOpen ? "text-olive-dark" : "text-stone-serene";
  const lineColor = isScrolled || isOpen ? "bg-olive-dark" : "bg-stone-serene";

  // Contador de prueba para el carrito
  const cartItemsCount = 0; 

  // NUEVO: Definimos nuestras rutas de forma estricta para evitar tildes en las URLs
  const navItems = [
    { name: "Colección", path: "/coleccion" },
    { name: "El Taller", path: "/el-taller" },
    { name: "Contacto", path: "/contacto" }
  ];

  return (
    <>
      <motion.header
        style={{ height: headerHeight, backgroundColor: headerBg }}
        className="fixed top-0 left-0 w-full z-[60] flex items-center justify-between px-8 md:px-16 transition-all duration-500 ease-in-out backdrop-blur-sm"
      >
        {/* Logotipo */}
        <Link href="/" className="z-50" onClick={() => setIsOpen(false)}>
          <h1 className={`font-cormorant text-2xl md:text-3xl tracking-widest uppercase transition-colors duration-500 ${textColor}`}>
            Mokuzai Art
          </h1>
        </Link>

        {/* Zona derecha: Navegación Desktop + Carrito + Menú Mobile */}
        <div className="flex items-center space-x-8 z-50">
          
          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-12">
            {/* NUEVO: Iteramos sobre navItems usando item.path */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`font-inter text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors duration-500 hover:opacity-50 ${textColor}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Botón del Carrito (Bolsa Minimalista) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`relative transition-colors duration-500 hover:opacity-50 ${textColor}`}
            aria-label="Abrir carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {/* Punto sutil si hay items en el carrito */}
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#A08963]" />
            )}
          </button>

          {/* Botón Menú Mobile */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-7 h-3 focus:outline-none flex flex-col justify-between"
            aria-label="Toggle menu"
          >
            <span 
              className={`absolute left-0 w-full h-[1px] transition-all duration-500 origin-center ${lineColor} ${
                isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
              }`} 
            />
            <span 
              className={`absolute left-0 w-full h-[1px] transition-all duration-500 origin-center ${lineColor} ${
                isOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
              }`} 
            />
          </button>
        </div>
      </motion.header>

      {/* Overlay de Menú Mobile (Ma - Espacio Negativo) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[#DBDBDB] flex flex-col items-center justify-center z-50"
          >
            <div className="flex flex-col items-center space-y-10">
              {/* NUEVO: Iteramos sobre navItems también en el menú móvil */}
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="font-cormorant text-4xl tracking-widest text-[#706D54] uppercase hover:opacity-60 transition-opacity"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="absolute bottom-16 w-[1px] h-12 bg-[#706D54]/30"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}