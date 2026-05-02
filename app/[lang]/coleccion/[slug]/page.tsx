import { client } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/lib/dictionary";
import CollectionDetailClient from "./CollectionDetailClient";

// Consulta GROQ: Buscamos 1 sola colección por su slug y emparejamos sus obras
const query = `*[_type == "collection" && slug.current == $slug][0] {
  "slug": slug.current,
  kanji,
  translations,
  "products": *[_type == "artwork" && category match $slug] | order(_createdAt asc) {
    "slug": slug.current,
    price,
    "image": image.asset->url,
    "hoverImage": hoverImage.asset->url,
    translations
  }
}`;

export default async function CollectionSlugPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;

  const dict = await getDictionary(lang as Locale);

  // Hacemos la llamada a Sanity pasándole el "slug" de la URL
  const collection = await client.fetch(query, { slug });

  // TRUCO DE SENIOR: Verificamos en terminal si la colección existe
  console.log(
    "🔥 COLECCIÓN BUSCADA:",
    slug,
    collection ? "✅ ENCONTRADA" : "❌ NO ENCONTRADA",
  );

  // Si alguien inventa una URL, mandamos a 404
  if (!collection || !collection.slug) {
    notFound();
  }

  // Ahora sí, pasamos la "collection" al componente cliente
  return (
    <main className="min-h-screen bg-[#DBDBDB]">
      <CollectionDetailClient collection={collection} lang={lang} dict={dict} />
    </main>
  );
}
