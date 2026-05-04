"use client";

import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

const DEFAULT_LANG = "es";
const ARTWORK_THUMB_SIZE = 80;
const ARTWORK_THUMB_PARAMS = `w=120&h=120&fit=crop&auto=format`;

export default function DashboardClient({ session, orders }: any) {
  const { lang, dict } = useI18n();

  return (
    <div className="max-w-5xl mx-auto px-6 py-32">
      {/* Cabecera Zen */}
      <header className="mb-20">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#A08963] mb-4 block"
        >
          Bienvenido, Coleccionista
        </motion.span>
        <div className="flex justify-between items-end">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-cormorant text-5xl md:text-6xl text-[#706D54]"
          >
            {session?.user?.name}
          </motion.h1>
          <button
            onClick={() => signOut({ callbackUrl: `/${lang}` })}
            className="font-inter text-[10px] tracking-widest uppercase text-[#706D54]/50 hover:text-[#706D54] transition-colors pb-2 border-b border-[#706D54]/20"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Listado de Pedidos / Obras */}
      <section>
        <h2 className="font-cormorant text-2xl text-[#706D54] mb-10 italic">
          Tus adquisiciones
        </h2>

        {orders.length === 0 ? (
          <div className="border-t border-[#706D54]/10 py-20 text-center">
            <p className="font-inter text-sm text-[#706D54]/60 italic">
              Aún no has iniciado tu colección. La madera espera tu elección.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const firstItem = order.items?.[0];
              const artwork = firstItem?.artworkRef;
              const artworkName =
                artwork?.translations?.[lang]?.name ||
                artwork?.translations?.[DEFAULT_LANG]?.name ||
                firstItem?.productName ||
                "Obra sin título";
              const imageUrl = artwork?.image?.asset?.url;
              const extraCount = (order.items?.length ?? 1) - 1;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white/30 backdrop-blur-sm p-8 flex flex-col md:flex-row justify-between items-center border border-[#706D54]/5 gap-6"
                >
                  {/* Miniatura de la obra */}
                  <div className="flex items-center gap-6 flex-1">
                    {imageUrl ? (
                      <Link
                        href={artwork?.slug ? `/${lang}/producto/${artwork.slug}` : "#"}
                        className="shrink-0"
                        tabIndex={artwork?.slug ? 0 : -1}
                      >
                        <Image
                          src={`${imageUrl}?${ARTWORK_THUMB_PARAMS}`}
                          alt={artworkName}
                          width={ARTWORK_THUMB_SIZE}
                          height={ARTWORK_THUMB_SIZE}
                          className="object-cover border border-[#706D54]/10"
                        />
                      </Link>
                    ) : (
                      <div className="w-20 h-20 bg-[#706D54]/5 border border-[#706D54]/10 shrink-0" />
                    )}

                    <div>
                      <span className="font-inter text-[10px] text-[#A08963] uppercase tracking-widest block mb-2">
                        Pedido {order.orderNumber}
                      </span>
                      <p className="font-cormorant text-xl text-[#706D54]">
                        {artworkName}
                        {extraCount > 0 && ` + ${extraCount} pieza${extraCount > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 text-right shrink-0">
                    <span
                      className={`px-4 py-1.5 rounded-full font-inter text-[9px] uppercase tracking-[0.2em] 
                      ${order.status === "Entregado" ? "bg-[#706D54] text-[#DBDBDB]" : "border border-[#706D54]/20 text-[#706D54]"}`}
                    >
                      {order.status}
                    </span>
                    <p className="font-inter text-xs text-[#706D54]/60 mt-3">
                      {order.totalAmount} €
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}


  return (
    <div className="max-w-5xl mx-auto px-6 py-32">
      {/* Cabecera Zen */}
      <header className="mb-20">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#A08963] mb-4 block"
        >
          Bienvenido, Coleccionista
        </motion.span>
        <div className="flex justify-between items-end">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-cormorant text-5xl md:text-6xl text-[#706D54]"
          >
            {session?.user?.name}
          </motion.h1>
          <button
            onClick={() => signOut({ callbackUrl: `/${lang}` })}
            className="font-inter text-[10px] tracking-widest uppercase text-[#706D54]/50 hover:text-[#706D54] transition-colors pb-2 border-b border-[#706D54]/20"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Listado de Pedidos / Obras */}
      <section>
        <h2 className="font-cormorant text-2xl text-[#706D54] mb-10 italic">
          Tus adquisiciones
        </h2>

        {orders.length === 0 ? (
          <div className="border-t border-[#706D54]/10 py-20 text-center">
            <p className="font-inter text-sm text-[#706D54]/60 italic">
              Aún no has iniciado tu colección. La madera espera tu elección.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const firstItem = order.items?.[0];
              const artwork = firstItem?.artworkRef;
              const artworkName =
                artwork?.translations?.[lang]?.name ||
                artwork?.translations?.es?.name ||
                firstItem?.productName ||
                "Obra sin título";
              const imageUrl = artwork?.image?.asset?.url;
              const extraCount = (order.items?.length ?? 1) - 1;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white/30 backdrop-blur-sm p-8 flex flex-col md:flex-row justify-between items-center border border-[#706D54]/5 gap-6"
                >
                  {/* Miniatura de la obra */}
                  <div className="flex items-center gap-6 flex-1">
                    {imageUrl ? (
                      <Link
                        href={artwork?.slug ? `/${lang}/producto/${artwork.slug}` : "#"}
                        className="shrink-0"
                        tabIndex={artwork?.slug ? 0 : -1}
                      >
                        <Image
                          src={`${imageUrl}?w=120&h=120&fit=crop&auto=format`}
                          alt={artworkName}
                          width={80}
                          height={80}
                          className="object-cover border border-[#706D54]/10"
                        />
                      </Link>
                    ) : (
                      <div className="w-20 h-20 bg-[#706D54]/5 border border-[#706D54]/10 shrink-0" />
                    )}

                    <div>
                      <span className="font-inter text-[10px] text-[#A08963] uppercase tracking-widest block mb-2">
                        Pedido {order.orderNumber}
                      </span>
                      <p className="font-cormorant text-xl text-[#706D54]">
                        {artworkName}
                        {extraCount > 0 && ` + ${extraCount} pieza${extraCount > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 text-right shrink-0">
                    <span
                      className={`px-4 py-1.5 rounded-full font-inter text-[9px] uppercase tracking-[0.2em] 
                      ${order.status === "Entregado" ? "bg-[#706D54] text-[#DBDBDB]" : "border border-[#706D54]/20 text-[#706D54]"}`}
                    >
                      {order.status}
                    </span>
                    <p className="font-inter text-xs text-[#706D54]/60 mt-3">
                      {order.totalAmount} €
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
