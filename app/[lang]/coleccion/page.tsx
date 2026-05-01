import { client } from "@/lib/sanity";
import CollectionClient from "./CollectionClient";
import { getDictionary, Locale } from "@/lib/dictionary";

// Consulta GROQ: Traemos las obras ordenadas por fecha de creación
const query = `*[_type == "artwork"] | order(_createdAt desc) {
  "slug": slug.current,
  price,
  category,
  "image": image.asset->url,
  "hoverImage": hoverImage.asset->url,
  translations
}`;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}) {
  // En Next.js 15 params es una promesa, si usas 14 es un objeto directo.
  // Usamos el await de forma segura.
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  const dict = await getDictionary(lang as Locale);
  const artworks = await client.fetch(query);

  return (
    <div className="min-h-screen bg-[#DBDBDB] pt-32">
      {/* Pasamos los datos puros y el diccionario a nuestro componente interactivo */}
      <CollectionClient artworks={artworks} dict={dict} lang={lang} />
    </div>
  );
}
