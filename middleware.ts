import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Los idiomas que nuestra galería soporta
const locales = ["es", "en", "eu", "ca", "de"];
const defaultLocale = "es";

// Función para detectar el idioma preferido del navegador del usuario
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  // Extraemos el código principal del idioma (ej. 'es-ES' -> 'es')
  const preferred = acceptLanguage.split(",")[0].split("-")[0];
  return locales.includes(preferred) ? preferred : defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Comprobamos si la URL ya tiene el idioma (ej. /en/coleccion)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Ignoramos los archivos estáticos (música, fotos, ruido de fondo) y rutas internas de Next.js
  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api")
  ) {
    return;
  }

  // Si no tiene idioma, detectamos el suyo y lo redirigimos elegantemente
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // Usamos redirect para que la URL en el navegador cambie y sea perfecta para SEO
  return NextResponse.redirect(request.nextUrl);
}

// Configuramos el middleware para que no se ejecute en imágenes o iconos
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
