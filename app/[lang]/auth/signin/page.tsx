"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function SignInPage() {
  const { lang, dict } = useI18n();

  return (
    <main className="min-h-screen bg-[#DBDBDB] flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-[#706D54] selection:text-[#DBDBDB]">
      {/* Círculo decorativo sutil de fondo (Estética Zen - Respiración) */}
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] border border-[#706D54] rounded-full pointer-events-none"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-md w-full relative z-10 flex flex-col items-center text-center"
      >
        <span className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#A08963] mb-6 block">
          {dict.signin.private_area}
        </span>

        <h1 className="font-cormorant text-5xl text-[#706D54] mb-4">
          {dict.signin.title}
        </h1>

        <p className="font-inter text-sm text-[#706D54]/70 mb-12 leading-relaxed">
          {dict.signin.description}
        </p>

        {/* Botón de Login Estilo Mokuzai (Google Exclusivo) */}
        <button
          onClick={() => signIn("google", { callbackUrl: `/${lang}/cuenta` })}
          className="group relative w-full flex items-center justify-center gap-4 py-4 px-8 border border-[#706D54] bg-transparent text-[#706D54] hover:bg-[#706D54] hover:text-[#DBDBDB] transition-all duration-500 overflow-hidden"
        >
          <svg
            className="w-4 h-4 transition-colors duration-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="font-inter text-xs tracking-[0.2em] uppercase">
            {dict.signin.continue_with_google}
          </span>
        </button>

        <div className="mt-12">
          <Link
            href={`/${lang}`}
            className="font-inter text-[10px] tracking-widest uppercase text-[#706D54]/50 hover:text-[#706D54] transition-colors border-b border-transparent hover:border-[#706D54]/30 pb-1"
          >
            {dict.signin.back_to_gallery}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
