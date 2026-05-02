import Hero from "@/components/Hero";
import CollectionsGrid from "@/components/CollectionsGrid";
import { client } from "@/lib/sanity";
import { getDictionary, Locale } from "@/lib/dictionary";

// Consulta GROQ: Traemos el Hero (solo hay 1) y las Colecciones
const query = `{
  "hero": *[_type == "home"][0] {
    "landscapeImage": landscapeImage.asset->url,
    "mobileImage": mobileImage.asset->url,
    translations
  },
  "collections": *[_type == "collection"] | order(_createdAt asc) {
    "slug": slug.current,
    categoryId,
    kanji,
    layout,
    "image": image.asset->url,
    "hotspot": image.hotspot,
    translations
  }
}`;

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  const dict = await getDictionary(lang as Locale);

  // Hacemos una única llamada a la base de datos para optimizar la velocidad
  const data = await client.fetch(query);

  return (
    <main className="min-h-screen bg-[#DBDBDB]">
      {/* 1. La Portada Majestuosa y Responsiva */}
      <Hero data={data.hero} dict={dict} lang={lang} />

      {/* 2. Nuestra Vitrina de Colecciones Maestras */}
      <CollectionsGrid
        collections={data.collections || []}
        dict={dict}
        lang={lang}
      />
    </main>
  );
}
