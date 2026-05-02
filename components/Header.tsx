"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // Importante para el icono
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { useSession } from "next-auth/react";
import CartDrawer from "@/components/CartDrawer";
import "../node_modules/flag-icons/css/flag-icons.min.css";

const LANGUAGES_CONFIG = [
  { code: "ES", name: "Español", icon: "es" },
  { code: "EN", name: "English", icon: "gb" },
  { code: "CA", name: "Català", icon: "es-ct" },
  { code: "EU", name: "Euskara", icon: "es-pv" },
  { code: "DE", name: "Deutsch", icon: "de" },
];

export default function Header({ musicUrl }: { musicUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { data: session } = useSession();

  const { lang, dict } = useI18n();

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("openCartDrawer", handleOpenCart);
    return () => window.removeEventListener("openCartDrawer", handleOpenCart);
  }, []);

  useEffect(() => {
    if (!musicUrl) {
      setIsPlaying(false);
      return;
    }
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.2;
    audio.preload = "auto";
    audio.load();
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
      setIsPlaying(false);
    };
  }, [musicUrl]);

  const toggleAudio = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.volume = 0.2;
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error al reproducir la música:", error);
        }
      }
    }
  };

  const switchLanguage = (newLang: string) => {
    if (!pathname) return;
    const lowerLang = newLang.toLowerCase();
    const newPath = pathname.replace(/^\/[^\/]+/, `/${lowerLang}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const headerHeight = useTransform(scrollY, [0, 100], ["100px", "70px"]);
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(219, 219, 219, 0)", "rgba(219, 219, 219, 0.95)"],
  );

  const isDarkHeroPage =
    pathname === `/${lang}` ||
    pathname === `/${lang}/el-taller` ||
    pathname?.startsWith(`/${lang}/producto/`);
  const textColor =
    isScrolled || isOpen || !isDarkHeroPage
      ? "text-[#706D54]"
      : "text-[#DBDBDB]";
  const lineColor =
    isScrolled || isOpen || !isDarkHeroPage ? "bg-[#706D54]" : "bg-[#DBDBDB]";

  const { cartCount } = useCart();

  const navItems = [
    { name: dict.navigation.collection, path: `/${lang}/coleccion` },
    { name: dict.navigation.workshop, path: `/${lang}/el-taller` },
  ];

  return (
    <>
      <motion.header
        style={{ height: headerHeight, backgroundColor: headerBg }}
        className="fixed top-0 left-0 w-full z-[60] flex items-center justify-between px-8 md:px-16 transition-all duration-500 ease-in-out backdrop-blur-sm"
      >
        {/* LOGO CON ICONO */}
        <Link
          href={`/${lang}`}
          className="z-50 flex items-center gap-4 group"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-8 h-8 md:w-9 md:h-9 transition-all duration-700 ease-out group-hover:scale-[0.96] group-hover:opacity-80">
            {" "}
            <Image
              src="/favicon.ico"
              alt="Mokuzai Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1
            className={`hidden sm:inline font-cormorant text-xl md:text-2xl tracking-[0.2em] uppercase transition-colors duration-500 whitespace-nowrap ${textColor}`}
          >
            Mokuzai Art
          </h1>
        </Link>

        <div className="flex items-center space-x-6 xl:space-x-8 z-50">
          {/* Audio Visualizer */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 transition-colors duration-500 hover:opacity-50 ${textColor}`}
          >
            <div className="flex items-end gap-[2px] h-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? [4, 12, 4] : 4 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8 + i * 0.2,
                    ease: "easeInOut",
                  }}
                  className={`w-[2px] ${lineColor}`}
                />
              ))}
            </div>
          </button>

          {/* Selector Idioma Desktop - Cambiado a xl para evitar colisión */}
          <div className="hidden xl:flex items-center gap-4 group relative">
            <div className="flex items-center gap-1 cursor-pointer py-2">
              <span
                className={`font-inter text-[10px] tracking-widest transition-colors duration-500 ${textColor}`}
              >
                {lang.toUpperCase()}
              </span>
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="none"
                className={`transition-transform duration-300 group-hover:rotate-180 ${textColor}`}
              >
                <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>

            <div className="absolute top-full right-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-[#DBDBDB]/95 backdrop-blur-md shadow-2xl border border-[#706D54]/10 py-3 min-w-[140px]">
                {LANGUAGES_CONFIG.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLanguage(l.code)}
                    className="w-full px-6 py-2 flex items-center gap-3 hover:bg-[#706D54]/5 transition-colors group/item"
                  >
                    <span
                      className={`fi fi-${l.icon} text-sm grayscale group-hover:grayscale-0 transition-all duration-500`}
                    />
                    <span className="font-inter text-[9px] tracking-[0.2em] uppercase text-[#706D54]">
                      {l.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navegación Desktop - Cambiado a xl */}
          <nav className="hidden xl:flex xl:space-x-12 border-l border-current/20 xl:pl-8">
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

          {/* Icono de Cuenta */}
          <Link
            href={session ? `/${lang}/cuenta` : `/${lang}/auth/signin`}
            className={`transition-colors duration-500 hover:text-[#A08963] ${textColor} flex items-center gap-2`}
          >
            {session && (
              <span className="font-inter text-[10px] tracking-widest uppercase hidden xl:inline">
                {session.user?.name?.split(" ")[0]}
              </span>
            )}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Carrito */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative transition-colors duration-500 hover:opacity-50 ${textColor}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#A08963]" />
            )}
          </button>

          {/* Menú Hamburguesa - Ahora visible desde xl para abajo */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden relative w-7 h-3 focus:outline-none flex flex-col justify-between"
          >
            <span
              className={`absolute left-0 w-full h-[1px] transition-all duration-500 ${lineColor} ${isOpen ? "top-1/2 -rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 w-full h-[1px] transition-all duration-500 ${lineColor} ${isOpen ? "top-1/2 rotate-45" : "bottom-0"}`}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#DBDBDB] flex flex-col items-center justify-center z-50"
          >
            {/* Contenido Menú Mobile... (mantiene tu lógica actual) */}
            <div className="flex flex-col items-center space-y-8 mb-12">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="font-cormorant text-4xl tracking-widest text-[#706D54] uppercase hover:opacity-60"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* ... Resto de tu menú móvil (Idiomas, Audio etc) ... */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {LANGUAGES_CONFIG.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLanguage(l.code)}
                  className="flex flex-col items-center gap-2"
                >
                  <span className={`fi fi-${l.icon} text-2xl`}></span>
                  <span className="font-inter text-[8px] tracking-[0.2em] uppercase text-[#706D54]">
                    {l.code}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={toggleAudio}
              className="flex items-center space-x-3 text-[#706D54]"
            >
              <span className="font-inter text-[10px] tracking-[0.2em] uppercase">
                {isPlaying ? "Pausar" : "Activar"} Atmósfera
              </span>
              {/* Reutilización de visualizer simple */}
              <div className="flex items-end gap-[1px] h-3">
                <div
                  className={`w-[2px] h-3 bg-current ${isPlaying ? "animate-pulse" : ""}`}
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
