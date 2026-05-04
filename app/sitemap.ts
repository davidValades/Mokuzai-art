import { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mokuzai-art.es";

  // Obtenemos todos los productos (colecciones/obras) de Sanity
  // Ajusta la query según cómo se llame tu schema de productos
  const query = `*[_type == "collection"]{ "slug": slug.current, _updatedAt }`;
  const products = await client.fetch(query);

  // Generamos las URLs dinámicas de los productos
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/es/coleccion/${product.slug}`,
    lastModified: product._updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Generamos las URLs estáticas (Home, Colección General, El Taller)
  const staticUrls = [
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0, // La Home es la prioridad máxima
    },
    {
      url: `${baseUrl}/es/coleccion`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es/el-taller`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/es/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...productUrls];
}
