import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { I18nProvider } from "@/context/I18nContext";
import { AuthProvider } from "@/components/Providers";
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
  title: {
    template: "%s | Mokuzai Art",
    default: "Mokuzai Art | El Alma de la Madera Japonesa", //
  },
  description:
    "Descubre piezas de artesanía premium talladas a mano. Diseño minimalista inspirado en la estética Zen y Japandi para hogares contemplativos.", //
  keywords: [
    "artesanía japonesa",
    "madera",
    "minimalismo",
    "japandi",
    "lujo silencioso",
    "decoración zen",
    "mokuzai",
  ],
  alternates: {
    canonical: "https://mokuzai-art.es",
    languages: {
      "es-ES": "https://mokuzai-art.es/es",
      "en-GB": "https://mokuzai-art.es/en",
      "ca-ES": "https://mokuzai-art.es/ca",
      "eu-ES": "https://mokuzai-art.es/eu",
      "de-DE": "https://mokuzai-art.es/de",
    },
  },
  openGraph: {
    title: "Mokuzai Art | El Alma de la Madera Japonesa", //
    description:
      "Descubre piezas de artesanía premium talladas a mano. Diseño minimalista inspirado en la estética Zen y Japandi para hogares contemplativos.", //
    url: "https://mokuzai-art.es", //
    siteName: "Mokuzai Art",
    images: [
      {
        url: "https://mokuzai-art.es/og-image.jpg", //
        width: 1200,
        height: 630,
        alt: "Bodegón de artesanía japonesa Mokuzai Art: lámparas, dioramas y sets de té.", //
      },
    ],
    locale: "es_ES",
    type: "website", //
  },
  twitter: {
    card: "summary_large_image", //
    title: "Mokuzai Art | El Alma de la Madera Japonesa", //
    description:
      "Descubre piezas de artesanía premium talladas a mano. Diseño minimalista inspirado en la estética Zen y Japandi para hogares contemplativos.", //
    images: ["https://mokuzai-art.es/og-image.jpg"], //
  },
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

  // Música servida desde la carpeta public.
  // Asegúrate de colocar el archivo en: public/ambient.mp3
  const musicUrl = "/mokuzai-ambient.mp3";

  return (
    <html lang={lang} className="scroll-smooth">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased bg-stone-serene text-olive-dark selection:bg-earth-noble/20 selection:text-olive-dark`}
      >
        {/* Envolvemos todo con nuestro proveedor de autenticación */}
        <AuthProvider>
          {/* Envolvemos la app con nuestro proveedor de idiomas */}
          <I18nProvider lang={lang} dict={dict}>
            <CartProvider>
              <Header musicUrl={musicUrl} />
              <main className="relative">{children}</main>
              <footer className="py-12 px-8 md:px-16 border-t border-olive-dark/10 bg-stone-serene">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
                  {/* 1. Marca (Izquierda en desktop, arriba en móvil) */}
                  <p className="font-cormorant text-lg tracking-widest uppercase shrink-0">
                    Mokuzai Art
                  </p>

                  {/* 2. Copyright (Centro) */}
                  <p className="font-inter text-[10px] md:text-xs tracking-widest opacity-60 uppercase text-center">
                    © 2026 Crafted with Dedication
                  </p>

                  {/* 3. Firma (Derecha en desktop, abajo en móvil) */}
                  <a
                    href="https://github.com/davidvalades"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-[#706D54]/80 hover:text-[#A08963] transition-colors duration-300 font-inter text-[10px] md:text-xs tracking-widest uppercase shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5 md:w-4 md:h-4"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Diseñado &amp; Desarrollado por David Valadés
                  </a>
                </div>
              </footer>
            </CartProvider>
          </I18nProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
