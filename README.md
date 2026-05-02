# Mokuzai Art 🪵

> **El alma de la madera.**  
> Repositorio oficial del entorno web y marketplace de Mokuzai Art.

Mokuzai Art es la representación digital de nuestro estudio de diseño y artesanía. La arquitectura refleja nuestros valores de marca: *Craftsmanship & dedication*, respeto por la naturaleza y armonía estética. El código, al igual que nuestras piezas, persigue el minimalismo orgánico, el lujo silencioso y la elegancia Japandi.

---

## Índice

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Sistema de Diseño](#2-sistema-de-diseño-uiux)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Rutas y Páginas](#4-rutas-y-páginas)
5. [Internacionalización (i18n)](#5-internacionalización-i18n)
6. [Esquemas de Contenido (Sanity)](#6-esquemas-de-contenido-sanity)
7. [Gestión de Activos y Fotografía](#7-gestión-de-activos-y-fotografía)
8. [Guía de Instalación](#8-guía-de-instalación)
9. [Variables de Entorno](#9-variables-de-entorno)
10. [Scripts Disponibles](#10-scripts-disponibles)
11. [Despliegue](#11-despliegue)

---

## 1. Stack Tecnológico

Arquitectura de **Headless Commerce** acoplada con un CMS especializado, priorizando rendimiento, personalización absoluta del checkout y calidad visual.

| Capa                    | Tecnología                  | Versión   | Propósito                                                                                           |
| :---------------------- | :-------------------------- | :-------- | :-------------------------------------------------------------------------------------------------- |
| **Framework Base**      | Next.js (App Router)        | 16.2.4    | SSG y SSR para SEO y carga ultra-rápida. Rutas dinámicas con `[lang]` y `[slug]`.                  |
| **Lenguaje**            | TypeScript                  | ^5        | Tipado estático en toda la base de código.                                                          |
| **Estilos**             | Tailwind CSS                | ^4        | Implementación precisa del sistema de diseño y paleta de colores corporativa.                       |
| **Animaciones**         | Framer Motion               | ^12       | Transiciones fluidas, scroll dinámico y micro-interacciones sensoriales.                            |
| **Gestor de Contenido** | Sanity.io (Headless CMS)    | ^5        | Modelado de datos para obras de arte, colecciones, artesanos y pedidos. Studio embebido en `/studio`. |
| **Pasarela de Pagos**   | Stripe                      | ^22       | Integración directa mediante API para un checkout inmersivo.                                        |
| **Autenticación**       | NextAuth.js                 | ^4        | Sesiones de usuario para la cuenta y el historial de pedidos.                                       |
| **Tipografía**          | Inter + Cormorant Garamond  | (Google)  | Inter para textos funcionales; Cormorant para titulares y marca.                                    |

---

## 2. Sistema de Diseño (UI/UX)

La interfaz es serena, pausada y sofisticada. Todo el equipo de frontend debe adherirse estrictamente a estas directrices.

### Paleta de Colores Corporativa

| Token                   | Hex       | Uso                              |
| :---------------------- | :-------- | :------------------------------- |
| **Gris piedra sereno**  | `#DBDBDB` | Fondo principal y espacios en blanco |
| **Verde oliva oscuro**  | `#706D54` | Acentos, contornos y navegación  |
| **Marrón tierra noble** | `#A08963` | Tipografía destacada y detalles  |
| **Madera clara cálida** | `#C9B194` | Resaltados y texturas             |

### Tipografía

- `font-cormorant` → Titulares, nombre de marca, nombres de obras (`Cormorant Garamond`)
- `font-inter` → Etiquetas, navegación, precios, microcopy (`Inter`)

### Comportamientos Clave

- **Header Dinámico:** Se contrae de `100px` a `70px` al hacer scroll (>50px). El fondo pasa de transparente a `rgba(219,219,219,0.95)` con `backdrop-blur`. En mobile, menú de pantalla completa con dos líneas ultradelgadas.
- **Color del Header:** Texto claro sobre los heroes de portada oscuros (`/`, `/el-taller`, `/producto/[slug]`); texto en oliva en el resto de páginas.
- **Espacio Negativo (Ma):** Márgenes generosos entre componentes. Sin sobrecarga de elementos interactivos.
- **Transiciones:** Hovers lentos y evocadores con opacidades y escalas mínimas.
- **Atmósfera Sonora:** Botón en el header reproduce `/public/mokuzai-ambient.mp3` en bucle a volumen 0.2.
- **Textura de Ruido:** Capa fija `z-[99]` con `opacity-[0.03]` sobre toda la UI para efecto de papel japonés.

---

## 3. Estructura del Proyecto

```
/
├── app/
│   ├── [lang]/              # Todas las rutas bajo el segmento de idioma
│   │   ├── layout.tsx       # Layout raíz: fonts, providers, header, footer
│   │   ├── page.tsx         # Página de inicio (Hero + CollectionsGrid)
│   │   ├── coleccion/       # Galería de colecciones
│   │   ├── el-taller/       # Historia del taller y los artesanos
│   │   ├── producto/[slug]/ # Página de detalle de obra
│   │   ├── checkout/        # Proceso de pago con Stripe
│   │   ├── cuenta/          # Área privada del usuario
│   │   └── auth/            # Inicio y cierre de sesión (NextAuth)
│   ├── api/
│   │   └── auth/            # Endpoints de NextAuth
│   └── studio/              # Sanity Studio embebido
├── components/
│   ├── Header.tsx           # Navegación dinámica, carrito, idioma, audio
│   ├── Hero.tsx             # Portada de la página de inicio
│   ├── CollectionsGrid.tsx  # Grid asimétrico de colecciones
│   ├── ProductCard.tsx      # Tarjeta de obra individual
│   ├── CartDrawer.tsx       # Panel lateral del carrito
│   └── Providers.tsx        # AuthProvider (SessionProvider de NextAuth)
├── context/
│   ├── CartContext.tsx      # Estado global del carrito
│   └── I18nContext.tsx      # Idioma activo y diccionario
├── lib/
│   ├── sanity.ts            # Cliente de Sanity (createClient)
│   ├── dictionary.ts        # Carga dinámica de diccionarios por idioma
│   ├── auth.ts              # Configuración de NextAuth
│   └── dictionaries/        # Archivos JSON de traducciones
│       ├── es.json
│       ├── en.json
│       ├── ca.json
│       ├── eu.json
│       └── de.json
├── sanity/
│   ├── schemaTypes/         # Esquemas de documentos Sanity
│   │   ├── artwork.ts       # Obra de arte (precio, imágenes, traducciones)
│   │   ├── collection.ts    # Colección (layout grid, portada)
│   │   ├── home.ts          # Contenido de la página de inicio
│   │   ├── workshop.ts      # Contenido de El Taller
│   │   ├── order.ts         # Pedido vinculado a usuario
│   │   └── user.ts          # Perfil de usuario
│   ├── env.ts               # Variables de entorno para Sanity
│   └── structure.ts         # Estructura personalizada del Studio
├── middleware.ts             # Detección de idioma y redirección automática
├── next.config.ts
├── tailwind.config.ts
├── sanity.config.ts
└── sanity.cli.ts
```

---

## 4. Rutas y Páginas

Todas las rutas están bajo el segmento dinámico `[lang]` (ej: `/es`, `/en`). El middleware detecta el idioma del navegador y redirige automáticamente.

| Ruta                          | Descripción                                        |
| :---------------------------- | :------------------------------------------------- |
| `/[lang]`                     | Inicio: Hero de portada + grid de colecciones      |
| `/[lang]/coleccion`           | Lista de todas las colecciones maestras            |
| `/[lang]/coleccion/[id]`      | Obras de arte de una colección específica          |
| `/[lang]/producto/[slug]`     | Detalle de obra: galería, descripción, precio, añadir al carrito |
| `/[lang]/el-taller`           | Historia del taller, filosofía y artesanos         |
| `/[lang]/checkout`            | Formulario de pago integrado con Stripe            |
| `/[lang]/cuenta`              | Área privada: perfil e historial de pedidos        |
| `/[lang]/auth/signin`         | Inicio de sesión (NextAuth)                        |
| `/studio`                     | Sanity Studio embebido (solo para administradores) |

---

## 5. Internacionalización (i18n)

El proyecto soporta 5 idiomas sin ninguna dependencia externa de i18n: el sistema está construido sobre el App Router y un middleware propio.

| Código | Idioma   | Bandera |
| :----- | :------- | :------ |
| `es`   | Español  | 🇪🇸      |
| `en`   | English  | 🇬🇧      |
| `ca`   | Català   | (es-ct) |
| `eu`   | Euskara  | (es-pv) |
| `de`   | Deutsch  | 🇩🇪      |

**Flujo:**
1. El `middleware.ts` lee el header `Accept-Language` del navegador.
2. Si la URL no incluye un prefijo de idioma, redirige a `/{locale}/...`.
3. El `I18nContext` expone `lang` y `dict` a todos los componentes cliente.
4. El contenido de Sanity tiene campo `translations` con un objeto por idioma.

---

## 6. Esquemas de Contenido (Sanity)

### `artwork` — Obras de Arte

| Campo          | Tipo     | Descripción                                        |
| :------------- | :------- | :------------------------------------------------- |
| `internalName` | string   | Identificador interno del taller                   |
| `slug`         | slug     | URL de la obra (generado desde `internalName`)     |
| `kanji`        | string   | Carácter japonés representativo (ej: `行灯`)        |
| `price`        | number   | Precio en euros                                    |
| `category`     | string   | `Meisho` · `Shokutaku` · `Budō`                    |
| `image`        | image    | Fotografía principal (hotspot activado)            |
| `hoverImage`   | image    | Imagen "iluminada" para el efecto noche en hover   |
| `translations` | object   | Nombre, descripción y detalles técnicos por idioma |

### `collection` — Colecciones Maestras

| Campo          | Tipo     | Descripción                                           |
| :------------- | :------- | :---------------------------------------------------- |
| `internalName` | string   | Nombre interno                                        |
| `slug`         | slug     | URL de la colección                                   |
| `kanji`        | string   | Carácter japonés                                      |
| `image`        | image    | Imagen de portada                                     |
| `layout`       | string   | Clase de Tailwind para el grid asimétrico en el Home  |
| `translations` | object   | Título y descripción por idioma                       |

### `home` — Página de Inicio

Contiene las imágenes del Hero en formato landscape y mobile, con traducciones del copy.

### `workshop` — El Taller

Contenido editorial sobre la filosofía del estudio y los artesanos.

### `order` — Pedidos

Vincula un usuario con las obras compradas, el total y el estado del pedido.

### `user` — Perfil de Usuario

Datos del cliente para el área privada `/cuenta`.

---

## 7. Gestión de Activos y Fotografía

La tasa de conversión depende de la calidad visual de piezas complejas.

- Todas las imágenes se sirven a través del **CDN de Sanity** (`@sanity/image-url`).
- El formato de salida recomendado es **WebP** para garantizar el LCP óptimo sin perder la nitidez de la veta.
- Se usa el componente `<Image />` nativo de Next.js con los atributos de optimización activados.
- Cada obra dispone de dos imágenes: `image` (día) y `hoverImage` (noche iluminada), con hotspot para el recorte inteligente.
- El audio de atmósfera se almacena en `/public/mokuzai-ambient.mp3` como activo estático.

---

## 8. Guía de Instalación

### Requisitos Previos

- Node.js 18+
- npm 9+
- Cuenta en [Sanity.io](https://sanity.io)
- Cuenta en [Stripe](https://stripe.com) (modo test para desarrollo)

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/davidValades/Mokuzai-art.git
cd Mokuzai-art

# 2. Instala las dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env.local
# → Edita .env.local con las claves de tu equipo (ver sección 9)

# 4. Inicia el servidor de desarrollo
npm run dev
```

Accede a [http://localhost:3000](http://localhost:3000) para ver la tienda.  
Accede a [http://localhost:3000/studio](http://localhost:3000/studio) para administrar el contenido en Sanity Studio.

---

## 9. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables. Solicita los valores al líder del equipo.

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

> ⚠️ **Nunca** subas `.env.local` al repositorio. Está incluido en `.gitignore`.

---

## 10. Scripts Disponibles

| Comando         | Descripción                                      |
| :-------------- | :----------------------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo en `localhost:3000` |
| `npm run build` | Genera la build de producción optimizada         |
| `npm run start` | Sirve la build de producción localmente          |
| `npm run lint`  | Ejecuta ESLint sobre toda la base de código      |

---

## 11. Despliegue

La rama `main` está conectada directamente a **Vercel**.

- Cada **Pull Request** genera un entorno de Preview automáticamente con URL única.
- Una vez aprobado el Code Review, el merge a `main` desencadena un despliegue en producción.
- Las variables de entorno de producción se configuran en el panel de Vercel, **no** en el repositorio.

Solo se aceptan commits que respeten la filosofía de **lujo silencioso** en el frontend y la máxima eficiencia en el backend.

---

<p align="center">
  <em>木材 — Mokuzai Art · El alma de la madera · © 2026 Crafted with Dedication</em>
</p>
