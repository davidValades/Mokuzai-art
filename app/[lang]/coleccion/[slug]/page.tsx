import ProductDetailClient from "@/components/ProductDetailClient";
import { client } from "@/lib/sanity";
import { getDictionary, Locale } from "@/lib/dictionary";
import { notFound } from "next/navigation";

const query = `*[_type == "artwork" && slug.current == $slug][0]{
  "slug": slug.current,
  kanji,
  price,
  category,
  "image": image.asset->url,
  "hoverImage": hoverImage.asset->url,
  "additionalImages": additionalImages[].asset->url,
  translations
}`;

export default async function CollectionProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  const dict = await getDictionary(lang as Locale);
  const productRaw = await client.fetch(query, { slug });

  if (!productRaw) {
    return notFound();
  }

  const t = productRaw.translations?.[lang] || productRaw.translations?.["es"] || {};
  const product = { ...productRaw, ...t };

  return <ProductDetailClient product={product} dict={dict} lang={lang} />;
}
