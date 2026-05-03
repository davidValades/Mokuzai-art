import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mokuzai-art.es";

  return {
    rules: {
      userAgent: "*", // Aplica a todos los robots (Google, Bing, etc.)
      allow: "/", // Pueden ver todo el contenido público
      disallow: ["/api/", "/cuenta/", "/auth/"], // Prohibido entrar a cuentas de usuario o APIs
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Le decimos dónde está el mapa
  };
}
