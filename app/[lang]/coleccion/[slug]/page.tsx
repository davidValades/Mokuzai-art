import { redirect } from "next/navigation";

export default async function CollectionSlugPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  redirect(`/${lang}/coleccion?categoria=${slug}`);
}
