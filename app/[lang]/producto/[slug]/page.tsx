import { client } from "@/lib/sanity";
import { getDictionary, Locale } from "@/lib/dictionary";
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";

const query = `*[_type == "artwork" && slug.current == $slug][0]{
  "slug": slug.current,
  kanji,
  price,
  category,
  isSold,
  allowsPyrography,
  "image": { "url": image.asset->url, "hotspot": image.hotspot },
  "hoverImage": { "url": hoverImage.asset->url, "hotspot": hoverImage.hotspot },
  "additionalImages": additionalImages[]{ "url": asset->url, "hotspot": hotspot },
  translations
}`;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;

  // 1. Buscamos el alma de las palabras (Diccionario)
  const dict = await getDictionary(lang as Locale);

  // 2. Buscamos la obra real en la base de datos de Sanity
  const productRaw = await client.fetch(query, { slug });

  // Si no hay obra, Next.js mostrará tu página 404 personalizada automáticamente
  if (!productRaw) return notFound();

  // 3. Fusionamos la traducción correcta en el servidor
  const t = productRaw.translations[lang] || productRaw.translations["es"];
  const product = { ...productRaw, ...t };

  // 4. Entregamos la obra ya pulida al componente visual
  return <ProductDetailClient product={product} dict={dict} lang={lang} />;
}
