"use client";

import { createContext, useContext, ReactNode } from "react";

// Definimos la estructura de nuestro contexto
interface I18nContextType {
  lang: string;
  dict: any; // Aquí residirá nuestro JSON completo
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  lang,
  dict,
  children,
}: {
  lang: string;
  dict: any;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ lang, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook personalizado para consumir las traducciones con elegancia
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n debe ser usado dentro de un I18nProvider");
  }
  return context;
}
