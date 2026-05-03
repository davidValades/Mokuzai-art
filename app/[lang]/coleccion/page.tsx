import { Suspense } from "react";
import { client } from "@/lib/sanity";
import { getDictionary, Locale } from "@/lib/dictionary";
import CollectionClient from "./CollectionClient";

// Traemos todas las obras (vendidas y disponibles). Las disponibles aparecen primero.
const query = `*[_type == "artwork"] | order(isSold asc, _createdAt desc) {
  "slug": slug.current,
  category,
  price,
  isSold,
  "image": image.asset->url,
  "hotspot": image.hotspot,
  "hoverImage": hoverImage.asset->url,
  "hoverHotspot": hoverImage.hotspot,
  translations
}`;

export default async function AllCollectionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { lang } = await params;
  const { categoria } = await searchParams;
  const dict = await getDictionary(lang as Locale);
  const artworks = await client.fetch(query);

  return (
    <main className="min-h-screen bg-[#DBDBDB] pt-32">
      <Suspense>
        <CollectionClient
          artworks={artworks}
          dict={dict}
          lang={lang}
          initialFilter={categoria}
        />
      </Suspense>
    </main>
  );
}
