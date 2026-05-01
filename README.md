This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Mokuzai Art 🪵

> **Mokuzai Art: El alma de la madera.**
> Repositorio oficial del entorno web y marketplace de Mokuzai Art.

Este proyecto es la representación digital de nuestro estudio de diseño y artesanía. Nuestra arquitectura debe reflejar nuestros valores de marca: Craftsmanship & dedication, respeto por la naturaleza y armonía estética. El código, al igual que nuestras piezas, persigue el minimalismo orgánico, el lujo silencioso y la elegancia Japandi.

---

## 1. Stack Tecnológico

Hemos optado por una arquitectura de **Headless Commerce** acoplada con un CMS especializado, priorizando el rendimiento, la personalización absoluta del checkout y la calidad visual.

| Capa                    | Tecnología               | Propósito en el Proyecto                                                                            |
| :---------------------- | :----------------------- | :-------------------------------------------------------------------------------------------------- |
| **Framework Base**      | Next.js (React)          | Generación estática (SSG) y Server-Side Rendering (SSR) para SEO y carga ultra-rápida.              |
| **Estilos**             | Tailwind CSS             | Implementación precisa del sistema de diseño y paleta de colores corporativa.                       |
| **Animaciones**         | Framer Motion            | Transiciones fluidas, scroll dinámico y micro-interacciones sensoriales.                            |
| **Gestor de Contenido** | Sanity.io (Headless CMS) | Modelado de datos estructurado para obras de arte, historias de artesanos y atributos de la madera. |
| **Pasarela de Pagos**   | Stripe                   | Integración directa mediante API para un checkout inmersivo sin abandonar nuestro dominio.          |

---

## 2. Sistema de Diseño (UI/UX)

La interfaz es serena, pausada y sofisticada. Todo el equipo de frontend debe adherirse estrictamente a estas directrices para mantener la cohesión.

**Paleta de Colores Corporativa**

- **Fondo Principal / Espacios en blanco:** #DBDBDB (Gris piedra sereno)
- **Acentos y Contornos:** #706D54 (Verde oliva / Tono orgánico oscuro)
- **Tipografía y Detalles:** #A08963 (Marrón tierra noble)
- **Resaltados y Texturas:** #C9B194 (Madera clara cálida)

**Comportamientos Clave**

- **Navegación Dinámica:** El encabezado se contrae en un 40% al hacer scroll vertical para ceder el protagonismo a la fotografía de la obra. En dispositivos móviles, se utiliza un icono de menú ultrafino (dos líneas) que despliega una pantalla completa.
- **Espacio Negativo (Ma):** Mantener márgenes generosos entre componentes. No sobrecargar la pantalla de elementos interactivos.
- **Transiciones:** Los cambios de estado (hovers) deben ser lentos y evocadores, utilizando opacidades y escalas mínimas (zoom in imperceptible).

---

## 3. Estructura del Proyecto

Utilizamos la convención estándar del App Router de Next.js, separando claramente la lógica de negocio de la presentación.

| Directorio  | Descripción                                                                |
| :---------- | :------------------------------------------------------------------------- |
| /app        | Rutas principales de la aplicación (Home, Galería, Checkout).              |
| /components | Componentes de UI reutilizables (Navegación, Botones, Tarjetas de Obra).   |
| /sanity     | Esquemas y configuración de nuestra base de datos en Sanity.io.            |
| /lib        | Funciones de utilidad, configuración de Stripe y llamadas a APIs externas. |
| /public     | Activos estáticos (Fuentes tipográficas locales, iconos).                  |
| /styles     | Archivo global de Tailwind CSS y configuraciones de variables de diseño.   |

---

## 4. Gestión de Activos y Fotografía

Nuestra tasa de conversión depende de la calidad visual de piezas complejas (jardines zen, celosías, etc.).

- Todas las fotografías de las obras deben ser procesadas y servidas a través del CDN de Sanity.
- El formato de salida obligatorio es WebP para garantizar la carga óptima (LCP) sin sacrificar la nitidez de la veta de la madera.
- Se utilizará el componente <Image /> nativo de Next.js con los atributos de optimización activados.

---

## 5. Guía de Instalación Rápida

Sigue estos pasos para levantar el entorno de desarrollo local:

1.  Clona este repositorio en tu máquina local.
2.  Duplica el archivo .env.example y renómbralo a .env.local.
3.  Solicita al líder del equipo las claves de acceso de Sanity y las claves de prueba (Test Keys) de Stripe e insértalas en tu .env.local.
4.  Ejecuta npm install para instalar las dependencias del proyecto.
5.  Inicia el servidor de desarrollo ejecutando npm run dev.
6.  Accede a http://localhost:3000 en tu navegador.

---

## 6. Despliegue

La rama main está conectada directamente a Vercel. Cada Pull Request hacia esta rama generará un entorno de Preview automáticamente. Una vez aprobado el código (Code Review), el merge desencadenará un despliegue en producción. Solo se aceptan commits que respeten la filosofía de "lujo silencioso" en el frontend y la máxima eficiencia en el backend.
