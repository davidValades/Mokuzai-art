"use client";

import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

export default function DashboardClient({ session, orders, dict }: any) {
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
            onClick={() => signOut()}
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
            {orders.map((order: any) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white/30 backdrop-blur-sm p-8 flex flex-col md:flex-row justify-between items-center border border-[#706D54]/5"
              >
                <div>
                  <span className="font-inter text-[10px] text-[#A08963] uppercase tracking-widest block mb-2">
                    Pedido {order.orderNumber}
                  </span>
                  <p className="font-cormorant text-xl text-[#706D54]">
                    {order.items[0].productName}{" "}
                    {order.items.length > 1 &&
                      `+ ${order.items.length - 1} pieza(s)`}
                  </p>
                </div>

                <div className="mt-6 md:mt-0 text-right">
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
