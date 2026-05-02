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
    default: "Mokuzai Art | El alma de la madera",
  },
  description:
    "Estudio de diseño y artesanía premium. Piezas decorativas talladas a mano inspiradas en el minimalismo japonés y la elegancia Japandi.",
  keywords: [
    "artesanía japonesa",
    "madera",
    "minimalismo",
    "japandi",
    "lujo silencioso",
    "decoración zen",
    "mokuzai",
  ],
  openGraph: {
    title: "Mokuzai Art | El alma de la madera",
    description:
      "Estudio de diseño y artesanía premium. Piezas decorativas talladas a mano inspiradas en el minimalismo japonés.",
    url: "https://mokuzai-art.vercel.app",
    siteName: "Mokuzai Art",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bodegón de artesanía japonesa Mokuzai Art: lámparas, dioramas y sets de té.",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mokuzai Art | El alma de la madera",
    description:
      "Estudio de diseño y artesanía premium inspirado en el minimalismo japonés.",
    images: ["/og-image.jpg"],
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
  const musicUrl = "/ambient.mp3";

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
