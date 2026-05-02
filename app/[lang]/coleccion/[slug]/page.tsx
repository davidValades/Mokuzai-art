import ProductDetailClient from "../../producto/[slug]/ProductDetailClient";
import { client } from "@/lib/sanity";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  // 1. Aquí haces tu llamada normal a Sanity para obtener el producto
  // (Ajusta esta query a cómo tengas montado tu esquema en Sanity)
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      ...,
      "imageUrl": images[0].asset->url
    }`,
    { slug },
  );

  if (!product) {
    return notFound();
  }

  // 2. Construimos el JSON-LD con los datos de Sanity
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.translations?.[lang]?.name || product.name,
    image: product.imageUrl,
    description:
      product.translations?.[lang]?.description || product.description,
    offers: {
      "@type": "Offer",
      url: `https://mokuzai-art.vercel.app/${lang}/producto/${slug}`,
      priceCurrency: "EUR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      {/* 3. Inyectamos el SEO en el HTML de forma invisible */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 4. Renderizamos tu componente Cliente de forma normal */}
      <ProductDetailClient product={product} lang={lang} />
    </>
  );
}
