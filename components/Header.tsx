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

export default function Header({ settings }: any) {
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

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        audioRef.current.volume = 0.2;
      }
      setIsPlaying(!isPlaying);
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

  // El lujo silencioso exige enfocarse solo en lo esencial. El contacto vivirá en el Footer.
  const navItems = [
    { name: dict.navigation.collection, path: `/${lang}/coleccion` },
    { name: dict.navigation.workshop, path: `/${lang}/el-taller` },
  ];

  return (
    <>
      {/* 
        El símbolo '?.' evita el cuelgue si algo es undefined. 
        El '||' pone tu archivo local por defecto mientras hacemos la conexión real. 
      */}
      <audio
        ref={audioRef}
        loop
        src={settings?.ambientMusic?.url || "/mokuzai-ambient.mp3"}
        preload="auto"
      />

      <motion.header
        style={{ height: headerHeight, backgroundColor: headerBg }}
        className="fixed top-0 left-0 w-full z-[60] flex items-center justify-between px-8 md:px-16 transition-all duration-500 ease-in-out backdrop-blur-sm"
      >
        <Link
          href={`/${lang}`}
          className="z-50"
          onClick={() => setIsOpen(false)}
        >
          <h1
            className={`font-cormorant text-2xl md:text-3xl tracking-widest uppercase transition-colors duration-500 ${textColor}`}
          >
            Mokuzai Art
          </h1>
        </Link>

        <div className="flex items-center space-x-6 md:space-x-8 z-50">
          <button
            onClick={toggleAudio}
            className={`hidden md:flex items-center gap-2 transition-colors duration-500 hover:opacity-50 ${textColor}`}
          >
            <div className="flex items-end gap-[2px] h-3">
              <motion.div
                animate={{ height: isPlaying ? ["4px", "10px", "4px"] : "4px" }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "easeInOut",
                }}
                className={`w-[2px] ${lineColor}`}
              ></motion.div>
              <motion.div
                animate={{ height: isPlaying ? ["8px", "4px", "8px"] : "4px" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className={`w-[2px] ${lineColor}`}
              ></motion.div>
              <motion.div
                animate={{ height: isPlaying ? ["6px", "12px", "6px"] : "4px" }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className={`w-[2px] ${lineColor}`}
              ></motion.div>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-4 group relative">
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

          <nav className="hidden md:flex space-x-8 lg:space-x-12 border-l border-current/20 pl-6 md:pl-8">
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

          {/* Área de autenticación y cuenta */}
          {session ? (
            <Link
              href={`/${lang}/cuenta`}
              className={`transition-colors duration-500 hover:text-[#A08963] ${textColor} flex items-center gap-2`}
            >
              <span className="font-inter text-[10px] tracking-widest uppercase hidden md:inline">
                {session.user?.name?.split(" ")[0] || "Cuenta"}
              </span>
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
          ) : (
            <Link
              href={`/${lang}/auth/signin`}
              className={`transition-colors duration-500 hover:text-[#A08963] ${textColor} ml-2`}
            >
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
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative transition-colors duration-500 hover:opacity-50 ${textColor} md:ml-4`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#A08963]" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-7 h-3 focus:outline-none flex flex-col justify-between ml-4"
          >
            <span
              className={`absolute left-0 w-full h-[1px] transition-all duration-500 origin-center ${lineColor} ${isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 w-full h-[1px] transition-all duration-500 origin-center ${lineColor} ${isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`}
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
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[#DBDBDB] flex flex-col items-center justify-center z-50"
          >
            <div className="flex flex-col items-center space-y-8 mb-12">
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
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-16 h-[1px] bg-[#706D54]/20 mb-12"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center space-y-8"
            >
              <div className="flex flex-wrap justify-center gap-6">
                {LANGUAGES_CONFIG.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLanguage(l.code)}
                    className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                      lang.toUpperCase() === l.code
                        ? "text-[#A08963] scale-110"
                        : "text-[#706D54]/60 hover:text-[#706D54]"
                    }`}
                  >
                    <span className={`fi fi-${l.icon} text-2xl`}></span>
                    <span className="font-inter text-[8px] tracking-[0.2em] uppercase">
                      {l.code}
                    </span>
                  </button>
                ))}
              </div>

              {session ? (
                <Link
                  href={`/${lang}/cuenta`}
                  onClick={() => setIsOpen(false)}
                  className="text-[#706D54] hover:text-[#A08963] transition-colors flex items-center gap-2"
                >
                  <span className="font-inter text-[10px] tracking-widest uppercase">
                    {session.user?.name?.split(" ")[0] || "Cuenta"}
                  </span>
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
              ) : (
                <Link
                  href={`/${lang}/auth/signin`}
                  onClick={() => setIsOpen(false)}
                  className="text-[#706D54] hover:text-[#A08963] transition-colors"
                >
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
              )}

              <button
                onClick={toggleAudio}
                className="flex items-center space-x-3 text-[#706D54]"
              >
                <span className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#706D54]/60">
                  {isPlaying ? "Pausar Atmósfera" : "Activar Atmósfera"}
                </span>
                <div className="flex items-end gap-[2px] h-3">
                  <motion.div
                    animate={{
                      height: isPlaying ? ["4px", "10px", "4px"] : "4px",
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                    }}
                    className="w-[2px] bg-[#706D54]"
                  ></motion.div>
                  <motion.div
                    animate={{
                      height: isPlaying ? ["8px", "4px", "8px"] : "4px",
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                    }}
                    className="w-[2px] bg-[#706D54]"
                  ></motion.div>
                  <motion.div
                    animate={{
                      height: isPlaying ? ["6px", "12px", "6px"] : "4px",
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "easeInOut",
                    }}
                    className="w-[2px] bg-[#706D54]"
                  ></motion.div>
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
