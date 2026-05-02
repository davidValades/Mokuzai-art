"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STATIC_CATEGORIES = [
  { id: "Meisho", name: "Meisho" },
  { id: "Shokutaku", name: "Shokutaku" },
  { id: "Budō", name: "Budō" },
  { id: "Kazaru", name: "Kazaru" },
];

const ALL_LABELS: Record<string, string> = {
  es: "Todas",
  en: "All",
  ca: "Totes",
  eu: "Guztiak",
  de: "Alle",
};

export default function CollectionClient({ artworks, dict, lang }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categories = useMemo(
    () => [
      { id: "all", name: ALL_LABELS[lang] ?? "Todas" },
      ...STATIC_CATEGORIES,
    ],
    [lang],
  );

  const resolveFilter = (param: string | null) => {
    if (!param) return "all";
    const found = categories.find(
      (cat) => cat.id.toLowerCase() === param.toLowerCase(),
    );
    return found ? found.id : "all";
  };

  const [filter, setFilter] = useState(() =>
    resolveFilter(searchParams.get("categoria")),
  );

  useEffect(() => {
    setFilter(resolveFilter(searchParams.get("categoria")));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories]);

  const handleFilterChange = (id: string) => {
    setFilter(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("categoria");
    } else {
      params.set("categoria", id);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const filteredArtworks = artworks.filter((art: any) =>
    filter === "all" ? true : art.category === filter,
  );

  return (
    <div className="px-8 md:px-16 pb-32">
      {/* Título de la Sección */}
      <div className="text-center mb-16">
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#706D54] mb-6 uppercase tracking-widest">
          {dict.navigation.collection}
        </h1>
        <div className="w-12 h-[1px] bg-[#A08963] mx-auto"></div>
      </div>

      {/* Filtros Minimalistas */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-20 border-b border-[#706D54]/10 pb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilterChange(cat.id)}
            className={`font-inter text-[10px] tracking-[0.4em] uppercase transition-all duration-500 relative ${
              filter === cat.id
                ? "text-[#A08963]"
                : "text-[#706D54]/40 hover:text-[#706D54]"
            }`}
          >
            {cat.name}
            {filter === cat.id && (
              <motion.div
                layoutId="activeCategory"
                className="absolute -bottom-[25px] left-0 w-full h-[1px] bg-[#A08963]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid de Obras (Exhibición) */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
      >
        <AnimatePresence mode="popLayout">
          {filteredArtworks.map((art: any) => {
            // Lógica de Rescate Multilingüe
            const t = art.translations?.[lang] || art.translations?.es || {};

            return (
              <motion.div
                key={art.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <Link href={`/${lang}/producto/${art.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#C9B194]/10 mb-8">
                    {/* Imagen Principal */}
                    <Image
                      src={art.image}
                      alt={t.name || "Obra Mokuzai Art"}
                      fill
                      className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105"
                    />

                    {/* Imagen Iluminada (Hover) */}
                    {art.hoverImage && (
                      <Image
                        src={art.hoverImage}
                        alt={`${t.name} detalle`}
                        fill
                        className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms] ease-in-out"
                      />
                    )}

                    {/* Velo sutil */}
                    <div className="absolute inset-0 bg-[#706D54]/0 group-hover:bg-[#706D54]/5 transition-colors duration-700" />
                  </div>

                  <div className="flex flex-col items-center text-center px-4">
                    <span className="font-inter text-[9px] tracking-[0.4em] text-[#A08963] uppercase mb-3">
                      {art.category}
                    </span>
                    <h3 className="font-cormorant text-2xl md:text-3xl text-[#706D54] mb-3 group-hover:text-[#A08963] transition-colors duration-500">
                      {t.name || "Obra sin título"}
                    </h3>
                    <p className="font-inter text-[11px] tracking-[0.2em] text-[#706D54]/60">
                      {art.price} €
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
