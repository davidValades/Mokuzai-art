"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Al cargar, comprobamos si ya hay una decisión guardada
    const consent = localStorage.getItem("mokuzai_cookie_consent");
    if (!consent) {
      // Le damos un pequeño retraso (1 segundo) para que no sea agresivo al entrar
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mokuzai_cookie_consent", "accepted");
    setIsVisible(false);

    // Si acepta, actualizamos el estado de Google Analytics para que empiece a medir
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("mokuzai_cookie_consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-8 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto bg-[#DBDBDB]/95 backdrop-blur-md border border-[#706D54]/10 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
            {/* Texto del Banner */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-cormorant text-xl tracking-widest uppercase text-[#706D54] mb-2">
                Privacidad & Serenidad
              </h3>
              <p className="font-inter text-xs tracking-wider text-[#706D54]/80 leading-relaxed max-w-2xl">
                Utilizamos cookies analíticas para entender cómo interactúas con
                nuestras obras y mejorar tu experiencia. Al igual que el tallado
                de la madera, valoramos tu tiempo y tu privacidad. Puedes leer
                más en nuestra{" "}
                <Link
                  href="/privacidad"
                  className="underline hover:text-[#A08963] transition-colors"
                >
                  política de privacidad
                </Link>
                .
              </p>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center gap-6 shrink-0 mt-4 md:mt-0">
              <button
                onClick={handleDecline}
                className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#706D54]/60 hover:text-[#706D54] transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={handleAccept}
                className="font-inter text-[10px] tracking-[0.2em] uppercase bg-[#706D54] text-[#DBDBDB] px-8 py-4 hover:bg-[#A08963] transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
