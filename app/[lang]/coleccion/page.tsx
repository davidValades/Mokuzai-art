import { client } from "@/lib/sanity";
import { getDictionary, Locale } from "@/lib/dictionary";
import CollectionClient from "./CollectionClient";

// Traemos todas las obras y sus categorías
const query = `*[_type == "artwork"] | order(_createdAt desc) {
  "slug": slug.current,
  category,
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
      <CollectionClient artworks={artworks} dict={dict} lang={lang} />
    </main>
  );
}
