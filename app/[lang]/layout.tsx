import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { I18nProvider } from "@/context/I18nContext";
import { AuthProvider } from "@/components/Providers"; // NUEVO: Proveedor de autenticación
import { getDictionary, Locale } from "@/lib/dictionary";

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

export const metadata: Metadata = {
  title: "Mokuzai Art | El alma de la madera",
  description:
    "Estudio de diseño y artesanía premium. Piezas decorativas talladas a mano inspiradas en el minimalismo japonés y la elegancia Japandi.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;

  // Extraemos el alma de las palabras para este idioma específico
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="scroll-smooth">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased bg-stone-serene text-olive-dark selection:bg-earth-noble/20 selection:text-olive-dark`}
      >
        <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] bg-[url('/noise.png')]"></div>

        {/* Envolvemos todo con nuestro proveedor de autenticación */}
        <AuthProvider>
          {/* Envolvemos la app con nuestro proveedor de idiomas */}
          <I18nProvider lang={lang} dict={dict}>
            <CartProvider>
              <Header />
              <main className="relative">{children}</main>
              <footer className="py-12 px-8 md:px-16 border-t border-olive-dark/10 bg-stone-serene">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                  <p className="font-cormorant text-lg tracking-widest uppercase">
                    Mokuzai Art
                  </p>
                  <p className="font-inter text-xs tracking-widest opacity-60 uppercase">
                    © 2026 Crafted with Dedication
                  </p>
                </div>
              </footer>
            </CartProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
