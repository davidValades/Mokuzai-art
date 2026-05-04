import ProductDetailClient from "@/components/ProductDetailClient";
import { client } from "@/lib/sanity";
import { getDictionary, Locale } from "@/lib/dictionary";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

const baseUrl = "https://mokuzai-art.es";

const metadataQuery = `*[_type == "artwork" && slug.current == $slug][0]{
  "name": coalesce(translations[$lang].name, internalName),
  "description": translations[$lang].description,
  "imageUrl": image.asset->url
}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;

  const dict = await getDictionary(lang as Locale);
  const product = await client.fetch(metadataQuery, { slug, lang });

  if (!product) {
    return { title: dict.product.not_found };
  }

  const currentUrl = `${baseUrl}/${lang}/coleccion/${slug}`;
  const title = `${product.name} | Mokuzai Art`;
  const description = product.description || dict.product.description_fallback;

  return {
    title,
    description,
    alternates: {
      canonical: currentUrl,
      languages: {
        "es-ES": `${baseUrl}/es/coleccion/${slug}`,
        "en-GB": `${baseUrl}/en/coleccion/${slug}`,
        "ca-ES": `${baseUrl}/ca/coleccion/${slug}`,
        "eu-ES": `${baseUrl}/eu/coleccion/${slug}`,
        "de-DE": `${baseUrl}/de/coleccion/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      images: product.imageUrl
        ? [
            {
              url: product.imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

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

export default async function CollectionProductPage({ params }: Props) {
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
      product.description || dict.product.description_fallback,
    brand: {
      "@type": "Brand",
      name: "Mokuzai Art",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/${lang}/coleccion/${slug}`,
      priceCurrency: "EUR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.isSold
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Mokuzai Art",
        item: `${baseUrl}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.navigation.collection,
        item: `${baseUrl}/${lang}/coleccion`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        item: `${baseUrl}/${lang}/coleccion/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetailClient product={product} dict={dict} lang={lang} />
    </>
  );
}
