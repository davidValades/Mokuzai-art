import { client } from "@/lib/sanity";
import { getDictionary, Locale } from "@/lib/dictionary";
import CollectionDetailClient from "./[slug]/CollectionDetailClient";

// Traemos todas las obras y sus categorías
const query = `*[_type == "product"] | order(_createdAt desc) {
  "slug": slug.current,
  "category": collection->title,
  price,
  "image": image.asset->url,
  "hoverImage": hoverImage.asset->url,
  translations
}`;

export default async function AllCollectionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const artworks = await client.fetch(query);

  return (
    <main className="min-h-screen bg-[#DBDBDB] pt-32">
      <CollectionDetailClient artworks={artworks} dict={dict} lang={lang} />
    </main>
  );
}
