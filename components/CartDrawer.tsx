"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro desenfocado (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#706D54]/40 backdrop-blur-sm z-[70]"
          />

          {/* El Cajón (Drawer) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#DBDBDB] shadow-2xl z-[80] flex flex-col"
          >
            {/* Cabecera del Cajón */}
            <div className="px-8 py-10 flex justify-between items-center border-b border-[#706D54]/10">
              <h2 className="font-cormorant text-3xl text-[#706D54]">Tu Selección</h2>
              <button 
                onClick={onClose}
                className="text-[#706D54]/60 hover:text-[#706D54] transition-colors p-2"
                aria-label="Cerrar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Lista de Obras */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <p className="font-cormorant text-2xl text-[#706D54] mb-4">El espacio está vacío.</p>
                  <p className="font-inter text-sm text-[#706D54]/80">Descubre piezas para tu colección.</p>
                </div>
              ) : (
                <ul className="space-y-8">
                  {cart.map((item) => (
                    <li key={item.id} className="flex gap-6 items-center">
                      <div className="relative w-24 h-32 flex-shrink-0 bg-[#DBDBDB]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-cormorant text-xl text-[#706D54] leading-tight mb-2">{item.name}</h3>
                        <p className="font-inter text-sm text-[#A08963] mb-4">{item.price} €</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-left font-inter text-[10px] tracking-widest uppercase text-[#706D54]/50 hover:text-[#706D54] transition-colors"
                        >
                          Retirar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pie del Cajón - Checkout */}
            {cart.length > 0 && (
              <div className="p-8 bg-[#DBDBDB] border-t border-[#706D54]/10">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-inter text-xs tracking-widest uppercase text-[#706D54]/80">Total</span>
                  <span className="font-inter text-xl text-[#706D54]">{cartTotal} €</span>
                </div>
                <button className="w-full py-5 bg-[#706D54] text-[#DBDBDB] font-inter text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#5a5743]">
                  Formalizar Adquisición
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}