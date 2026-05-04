"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function applyGtagConsent(prefs: CookiePreferences) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("consent", "update", {
      analytics_storage: prefs.analytics ? "granted" : "denied",
      ad_storage: prefs.marketing ? "granted" : "denied",
      ad_user_data: prefs.marketing ? "granted" : "denied",
      ad_personalization: prefs.marketing ? "granted" : "denied",
    });
  }
}

export default function CookieBanner({ lang = "es" }: { lang?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const saved = localStorage.getItem("mokuzai_cookie_preferences");
    if (!saved) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    // Apply previously saved consent on page load
    try {
      const parsed: CookiePreferences = JSON.parse(saved);
      applyGtagConsent(parsed);
    } catch {
      // malformed data → show banner again
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveAndClose = (prefs: CookiePreferences) => {
    localStorage.setItem("mokuzai_cookie_preferences", JSON.stringify(prefs));
    applyGtagConsent(prefs);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveAndClose({ necessary: true, analytics: true, marketing: true });
  };

  const handleDeclineAll = () => {
    saveAndClose({ necessary: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveAndClose(preferences);
  };

  const toggle = (key: keyof Omit<CookiePreferences, "necessary">) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
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
          <div className="max-w-5xl mx-auto bg-[#DBDBDB]/95 backdrop-blur-md border border-[#706D54]/10 shadow-2xl pointer-events-auto">
            {/* Panel principal */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Texto del Banner */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-cormorant text-xl tracking-widest uppercase text-[#706D54] mb-2">
                  Privacidad & Serenidad
                </h3>
                <p className="font-inter text-xs tracking-wider text-[#706D54]/80 leading-relaxed max-w-2xl">
                  Utilizamos cookies para mejorar tu experiencia. Puedes elegir
                  qué tipos de cookies permites o leer más en nuestra{" "}
                  <Link
                    href={`/${lang}/privacidad`}
                    className="underline hover:text-[#A08963] transition-colors"
                  >
                    política de privacidad
                  </Link>
                  .
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <button
                  onClick={() => setIsExpanded((v) => !v)}
                  className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#706D54]/60 hover:text-[#706D54] transition-colors border border-[#706D54]/30 px-5 py-3"
                >
                  {isExpanded ? "Ocultar" : "Configurar"}
                </button>
                <button
                  onClick={handleDeclineAll}
                  className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#706D54]/60 hover:text-[#706D54] transition-colors"
                >
                  Rechazar
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="font-inter text-[10px] tracking-[0.2em] uppercase bg-[#706D54] text-[#DBDBDB] px-8 py-4 hover:bg-[#A08963] transition-colors"
                >
                  Aceptar todo
                </button>
              </div>
            </div>

            {/* Panel de configuración expandible */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden border-t border-[#706D54]/10"
                >
                  <div className="p-6 md:p-8 pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Necesarias */}
                    <CookieToggleRow
                      label="Cookies necesarias"
                      description="Imprescindibles para el funcionamiento del sitio (sesión, carrito). Siempre activas."
                      checked={true}
                      disabled
                    />

                    {/* Analíticas */}
                    <CookieToggleRow
                      label="Cookies analíticas"
                      description="Nos permiten entender cómo navegas por la galería y mejorar la experiencia (Google Analytics)."
                      checked={preferences.analytics}
                      onChange={() => toggle("analytics")}
                    />

                    {/* Marketing */}
                    <CookieToggleRow
                      label="Cookies de marketing"
                      description="Utilizadas para mostrarte contenido y anuncios relevantes fuera de nuestra galería."
                      checked={preferences.marketing}
                      onChange={() => toggle("marketing")}
                    />
                  </div>

                  <div className="px-6 md:px-8 pb-6 flex justify-end">
                    <button
                      onClick={handleSavePreferences}
                      className="font-inter text-[10px] tracking-[0.2em] uppercase bg-[#706D54] text-[#DBDBDB] px-8 py-4 hover:bg-[#A08963] transition-colors"
                    >
                      Guardar preferencias
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CookieToggleRow({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-inter text-[10px] tracking-[0.15em] uppercase text-[#706D54] font-medium">
          {label}
        </span>
        <button
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={onChange}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          } ${checked ? "bg-[#706D54]" : "bg-[#706D54]/20"}`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-[#DBDBDB] shadow-sm transform transition-transform duration-300 mt-0.5 ${
              checked ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
      <p className="font-inter text-[10px] tracking-wide text-[#706D54]/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
