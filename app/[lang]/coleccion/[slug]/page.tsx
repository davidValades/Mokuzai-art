import ProductDetailClient from "@/components/ProductDetailClient";
import { client } from "@/lib/sanity";
import { getDictionary, Locale } from "@/lib/dictionary";
import { notFound } from "next/navigation";

const query = `*[_type == "artwork" && slug.current == $slug][0]{
  "slug": slug.current,
  kanji,
  price,
  isSold,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name || product.kanji,
    image: product.image,
    description:
      product.description ||
      "Obra de artesanía premium tallada a mano de la colección Mokuzai Art.",
    brand: {
      "@type": "Brand",
      name: "Mokuzai Art",
    },
    offers: {
      "@type": "Offer",
      url: `https://mokuzai-art.es/${lang}/coleccion/${slug}`,
      priceCurrency: "EUR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.isSold
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetailClient product={product} dict={dict} lang={lang} />
    </>
  );
}
