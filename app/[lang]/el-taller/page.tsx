import { client } from "@/lib/sanity";
import WorkshopClient from "./WorkshopClient";

const query = `*[_type == "workshop"][0] {
  "heroImageLight": heroImageLight.asset->url,
  "heroImageDark": heroImageDark.asset->url,
  "detailImage": detailImage.asset->url,
  translations
}`;

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  const data = await client.fetch(query);

  return <WorkshopClient data={data} lang={lang} />;
}
