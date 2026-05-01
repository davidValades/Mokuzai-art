import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

// Configuración de fuentes con variables CSS para uso en Tailwind
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "600"],
  display: "swap",
});

// Metadatos para SEO: Masterful & Respectful
export const metadata: Metadata = {
  title: "Mokuzai Art | El alma de la madera",
  description: "Estudio de diseño y artesanía premium. Piezas decorativas talladas a mano inspiradas en el minimalismo japonés y la elegancia Japandi.",
  keywords: ["Artesanía en madera", "Arte Japonés", "Lujo silencioso", "Diseño Japandi", "Mokuzai"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body 
        className={`
          ${inter.variable} 
          ${cormorant.variable} 
          font-sans 
          antialiased 
          bg-stone-serene 
          text-olive-dark 
          selection:bg-earth-noble/20 
          selection:text-olive-dark
        `}
      >
        {/* Capa de grano sutil para textura orgánica (Opcional pero recomendado para Premium Feel) */}
        <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] bg-[url('/noise.png')]"></div>

        <Header />
        
        {/* El contenedor principal debe respetar el espacio del Header dinámico */}
        <main className="relative">
          {children}
        </main>

        {/* El Footer será nuestro siguiente gran bloque de diseño */}
        <footer className="py-12 px-8 md:px-16 border-t border-olive-dark/10 bg-stone-serene">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="font-cormorant text-lg tracking-widest uppercase">Mokuzai Art</p>
             <p className="font-inter text-xs tracking-widest opacity-60 uppercase">© 2026 Crafted with Dedication</p>
           </div>
        </footer>
      </body>
    </html>
  );
}