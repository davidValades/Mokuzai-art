"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function WorkshopClient({
  data,
  lang,
}: {
  data: any;
  lang: string;
}) {
  const { scrollY } = useScroll();

  // Mantenemos tus animaciones originales
  const yImage = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  // Selección de traducción
  const t = data?.translations?.[lang] || data?.translations?.es || {};

  return (
    <div className="min-h-screen bg-[#DBDBDB] selection:bg-[#706D54] selection:text-[#DBDBDB]">
      {/* 1. HERO SECTION: Tu efecto Chiaroscuro dinámico */}
      <div className="relative w-full h-screen overflow-hidden bg-[#706D54]">
        <motion.div
          style={{ y: yImage }}
          className="absolute inset-0 w-full h-full group"
        >
          {/* Imagen Clara desde Sanity */}
          {data?.heroImageLight && (
            <Image
              src={data.heroImageLight}
              alt="Taller Mokuzai Art"
              fill
              priority
              className="object-cover object-center"
            />
          )}

          {/* Imagen Chiaroscuro desde Sanity */}
          {data?.heroImageDark && (
            <Image
              src={data.heroImageDark}
              alt="Mesa de trabajo en penumbra"
              fill
              priority
              className="object-cover object-center transition-opacity duration-[2000ms] ease-in-out group-hover:opacity-0"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#DBDBDB]/20 via-transparent to-transparent pointer-events-none"></div>
        </motion.div>

        <motion.div
          style={{ opacity: opacityText }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-inter text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#DBDBDB] mb-6 block drop-shadow-md"
          >
            Craftsmanship & Dedication
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-cormorant text-6xl md:text-8xl lg:text-9xl text-[#DBDBDB] tracking-wide drop-shadow-lg"
          >
            {t.heroTitle || "El Taller"}
          </motion.h1>
        </motion.div>
      </div>

      {/* 2. EL MANIFIESTO: Manteniendo el Ma (Espacio Negativo) */}
      <div className="relative z-20 bg-[#DBDBDB] pt-32 pb-24 px-6 md:px-16 lg:px-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="font-cormorant text-6xl text-[#C9B194] opacity-50 block mb-6">
              工房
            </span>
            <h2 className="font-cormorant text-4xl md:text-5xl text-[#706D54] leading-tight mb-12">
              {t.manifestoTitle} <br /> {t.manifestoSubtitle}
            </h2>
            <p className="font-inter text-lg text-[#706D54]/80 leading-relaxed max-w-2xl mx-auto">
              {t.manifestoText}
            </p>
          </motion.div>
        </div>
      </div>
      {/* 2.5 NUEVA SECCIÓN: EL SHOKUNIN (Ricardo) */}
      <div className="w-full bg-[#C9B194]/10 flex flex-col md:flex-row items-stretch border-t border-[#706D54]/10">
        {/* Columna Izquierda: Imagen a sangre */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 relative min-h-[60vh] md:min-h-screen"
        >
          {data?.shokuninImage && (
            <Image
              src={data.shokuninImage}
              alt="Ricardo, el Shokunin en su taller"
              fill
              className="object-cover object-center"
            />
          )}
        </motion.div>

        {/* Columna Derecha: Historia y Marca de Agua */}
        <div className="w-full md:w-1/2 relative px-8 py-20 md:p-20 lg:p-32 flex flex-col justify-center overflow-hidden">
          {/* Marca de agua gigante 'リ' */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[350px] md:text-[500px] text-[#706D54] opacity-[0.03] font-cormorant pointer-events-none select-none">
            リ
          </span>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10"
          >
            <h2 className="font-cormorant text-5xl md:text-6xl text-[#706D54] mb-4">
              {t.shokuninTitle || "El Camino de la Madera: El Shokunin"}
            </h2>
            <h3 className="font-inter text-sm tracking-[0.2em] uppercase text-[#706D54]/60 mb-10">
              {t.shokuninSubtitle || "El alma detrás del formón"}
            </h3>

            {/* Truco: Separar el campo de texto en párrafos usando los saltos de línea de Sanity */}
            <div className="font-inter text-[#706D54]/80 space-y-6 leading-relaxed mb-12">
              {(
                t.shokuninText ||
                "Detrás de cada obra se encuentra Ricardo...\n\nComo 6º Dan de Karate Shito-Ryu..."
              )
                .split("\n")
                .map(
                  (paragraph: string, idx: number) =>
                    paragraph.trim() !== "" && <p key={idx}>{paragraph}</p>,
                )}
            </div>

            {/* Bloque de la Firma */}
            <div className="border-t border-[#706D54]/20 pt-8">
              <h4 className="font-cormorant text-3xl text-[#706D54] mb-3 flex items-center gap-4">
                {t.shokuninSignatureTitle || "La Firma (リ)"}
              </h4>
              <p className="font-inter text-sm text-[#706D54]/70 leading-relaxed max-w-md">
                {t.shokuninSignatureText ||
                  "Cada obra que abandona el taller lleva grabado su sello. Representa la promesa de que esa pieza ha sido creada con la misma integridad, paciencia y espíritu inquebrantable que exige el arte marcial."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. IMAGEN DIVISORIA: Sanity + Tu estética Grayscale */}
      <div className="w-full py-16 bg-[#706D54] px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 relative aspect-square md:aspect-[4/3] overflow-hidden"
        >
          {data?.detailImage && (
            <Image
              src={data.detailImage}
              alt="Detalle artesanal"
              fill
              className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <h3 className="font-cormorant text-4xl text-[#DBDBDB] mb-6">
            {t.detailTitle}
          </h3>
          <p className="font-inter text-[#DBDBDB]/80 leading-relaxed mb-8 max-w-lg">
            {t.detailText}
          </p>
          <ul className="space-y-4">
            {t.detailBullets?.map((item: string, idx: number) => (
              <li
                key={idx}
                className="font-inter text-sm text-[#DBDBDB]/70 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#A08963] mr-4 block"></span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 4. CIERRE Y LLAMADA A LA ACCIÓN DINÁMICA */}
      <div className="py-32 px-6 text-center bg-[#DBDBDB]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-cormorant text-2xl italic text-[#706D54] mb-10">
            {/* Usamos la traducción de Sanity con un fallback por seguridad */}
            {t.ctaText ||
              "Descubre las piezas que han nacido en esta mesa de trabajo."}
          </p>
          <Link
            href={`/${lang}/coleccion`}
            className="inline-block py-4 px-12 border border-[#706D54] text-[#706D54] font-inter text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#706D54] hover:text-[#DBDBDB]"
          >
            {t.ctaButton || "Explorar la Colección"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
