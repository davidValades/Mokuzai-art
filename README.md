# Mokuzai Art 🪵

> **El alma de la madera.**  
> Repositorio oficial del entorno web y marketplace de Mokuzai Art.

Mokuzai Art es la representación digital de nuestro estudio de diseño y artesanía. La arquitectura refleja nuestros valores de marca: *Craftsmanship & dedication*, respeto por la naturaleza y armonía estética. El código, al igual que nuestras piezas, persigue el minimalismo orgánico, el lujo silencioso y la elegancia Japandi.

---

## Índice

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Sistema de Diseño](#2-sistema-de-diseño-uiux)
3. [Arquitectura y Flujo de Datos](#3-arquitectura-y-flujo-de-datos)
4. [Estructura del Proyecto](#4-estructura-del-proyecto)
5. [Rutas y Páginas](#5-rutas-y-páginas)
6. [Internacionalización (i18n)](#6-internacionalización-i18n)
7. [Esquemas de Contenido (Sanity)](#7-esquemas-de-contenido-sanity)
8. [Carrito de Compra](#8-carrito-de-compra)
9. [Rutas de API](#9-rutas-de-api)
10. [Autenticación](#10-autenticación)
11. [Gestión de Activos y Fotografía](#11-gestión-de-activos-y-fotografía)
12. [Guía de Instalación](#12-guía-de-instalación)
13. [Variables de Entorno](#13-variables-de-entorno)
14. [Scripts Disponibles](#14-scripts-disponibles)
15. [Despliegue](#15-despliegue)
16. [Contribuir](#16-contribuir)

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
| **Autenticación**       | NextAuth.js                 | ^4        | Sesiones de usuario con Google OAuth y proveedor de credenciales.                                   |
| **Iconos de Idioma**    | flag-icons                  | ^7        | Banderas SVG para el selector de idioma en el header.                                               |
| **Email transaccional** | Nodemailer                  | ^7        | Envío de emails de confirmación al cliente y al administrador tras cada pedido completado.          |
| **Tipografía**          | Inter + Cormorant Garamond  | (Google)  | Inter para textos funcionales; Cormorant para titulares y marca.                                    |

---

## 2. Sistema de Diseño (UI/UX)

La interfaz es serena, pausada y sofisticada. Todo el equipo de frontend debe adherirse estrictamente a estas directrices.

### Paleta de Colores Corporativa

| Token                   | Hex       | Uso                                       |
| :---------------------- | :-------- | :---------------------------------------- |
| **Gris piedra sereno**  | `#DBDBDB` | Fondo principal y espacios en blanco      |
| **Verde oliva oscuro**  | `#706D54` | Acentos, contornos, navegación y textos   |
| **Marrón tierra noble** | `#A08963` | Tipografía destacada, detalles y badges   |
| **Madera clara cálida** | `#C9B194` | Resaltados y texturas                     |

### Tipografía

- `font-cormorant` → Titulares, nombre de marca, nombres de obras (`Cormorant Garamond`)
- `font-inter` → Etiquetas, navegación, precios, microcopy (`Inter`)

### Comportamientos Clave

- **Header Dinámico:** Se contrae de `100px` a `70px` al hacer scroll (>50px). El fondo pasa de transparente a `rgba(219,219,219,0.95)` con `backdrop-blur`. En pantallas menores a `xl`, se muestra un menú hamburguesa de dos líneas ultradelgadas que abre un overlay de pantalla completa.
- **Color del Header:** Texto claro (`#DBDBDB`) sobre los heroes de portada oscuros (`/`, `/el-taller`, `/producto/[slug]`); texto en oliva (`#706D54`) en el resto de páginas. El cambio es automático con `isScrolled`.
- **Selector de Idioma:** Dropdown en desktop (visible desde `xl`) con banderas SVG de `flag-icons` en escala de grises con saturación al hover. En mobile, las banderas se muestran dentro del menú overlay.
- **Espacio Negativo (Ma):** Márgenes generosos entre componentes. Sin sobrecarga de elementos interactivos.
- **Transiciones:** Hovers lentos y evocadores con opacidades y escalas mínimas.
- **Atmósfera Sonora:** Botón visualizador animado en el header que reproduce `/public/mokuzai-ambient.mp3` en bucle a volumen 0.2. El audio se crea de forma diferida al primer gesto del usuario para compatibilidad con políticas de autoplay de móvil.
- **Textura de Ruido:** Capa fija `z-[99]` con `opacity-[0.03]` sobre toda la UI para efecto de papel japonés.

---

## 3. Arquitectura y Flujo de Datos

```
Navegador
  │
  ├─► middleware.ts          # Detecta idioma → redirige a /[lang]/...
  │
  ├─► Next.js App Router
  │     ├─ Server Components  # Consultan Sanity en tiempo de build/request
  │     └─ Client Components  # Interacciones: carrito, idioma, audio, auth
  │
  ├─► Sanity.io (CDN)        # Fuente de verdad del contenido (obras, colecciones, home, taller)
  │     └─ /studio           # Admin embebido, accesible solo para el equipo
  │
  ├─► NextAuth.js            # Gestión de sesión (Google OAuth + Credenciales de prueba)
  │     └─ /api/auth         # Endpoints automáticos de NextAuth
  │
  └─► Stripe                 # Procesamiento de pago en /checkout
```

### Contextos Globales (Client-side)

| Contexto        | Archivo                  | Estado que provee                          |
| :-------------- | :----------------------- | :----------------------------------------- |
| `CartContext`   | `context/CartContext.tsx` | `cart`, `addToCart`, `removeFromCart`, `clearCart`, `cartTotal`, `cartCount` |
| `I18nContext`   | `context/I18nContext.tsx` | `lang` (código activo), `dict` (traducciones JSON) |

---

## 4. Estructura del Proyecto

```
/
├── app/
│   ├── [lang]/              # Todas las rutas bajo el segmento de idioma
│   │   ├── layout.tsx       # Layout raíz: fonts, providers, header, footer
│   │   ├── page.tsx         # Página de inicio (Hero + CollectionsGrid)
│   │   ├── coleccion/       # Lista de colecciones maestras
│   │   │   └── [slug]/      # Obras de una colección específica
│   │   ├── el-taller/       # Historia del taller y los artesanos
│   │   ├── producto/[slug]/ # Página de detalle de obra (galería, precio, carrito)
│   │   ├── checkout/        # Proceso de pago con Stripe
│   │   │   └── success/     # Confirmación de pedido (limpia el carrito)
│   │   ├── cuenta/          # Área privada del usuario (requiere sesión)
│   │   └── auth/signin/     # Inicio de sesión (NextAuth)
│   ├── api/
│   │   ├── auth/[...nextauth]/ # Endpoints automáticos de NextAuth
│   │   ├── checkout/        # POST: crea PaymentIntent en Stripe; PATCH: actualiza email del cliente
│   │   ├── webhook/         # POST: webhook de Stripe (confirma pago, registra pedido, envía emails)
│   │   └── user/            # GET: devuelve datos del usuario autenticado y última dirección de envío
│   ├── robots.ts            # Configuración de robots.txt
│   ├── sitemap.ts           # Sitemap dinámico para SEO
│   └── studio/[[...tool]]/ # Sanity Studio embebido
├── components/
│   ├── Header.tsx           # Navegación dinámica, carrito, idioma, audio
│   ├── Hero.tsx             # Portada de la página de inicio
│   ├── CollectionsGrid.tsx  # Grid asimétrico de colecciones
│   ├── ProductCard.tsx      # Tarjeta de obra individual
│   ├── ProductDetailClient.tsx # Vista de detalle de producto (client)
│   ├── CartDrawer.tsx       # Panel lateral del carrito
│   └── Providers.tsx        # SessionProvider de NextAuth
├── context/
│   ├── CartContext.tsx      # Estado global del carrito (persiste en localStorage)
│   └── I18nContext.tsx      # Idioma activo y diccionario
├── lib/
│   ├── sanity.ts            # Cliente de Sanity (createClient)
│   ├── dictionary.ts        # Carga dinámica de diccionarios por idioma
│   ├── auth.ts              # Configuración de NextAuth (Google + Credentials)
│   └── dictionaries/        # Archivos JSON de traducciones
│       ├── es.json
│       ├── en.json
│       ├── ca.json
│       ├── eu.json
│       └── de.json
├── sanity/
│   ├── schemaTypes/         # Esquemas de documentos Sanity
│   │   ├── artwork.ts       # Obra de arte (precio, imágenes, categoría, traducciones)
│   │   ├── collection.ts    # Colección (layout grid, categoryId, portada)
│   │   ├── home.ts          # Contenido de la página de inicio
│   │   ├── workshop.ts      # Contenido de El Taller
│   │   ├── order.ts         # Pedido vinculado a usuario
│   │   ├── user.ts          # Perfil de usuario
│   │   └── index.ts         # Registro de todos los esquemas
│   ├── lib/
│   │   ├── client.ts        # Cliente de Sanity para el Studio
│   │   ├── image.ts         # Helper urlFor() con @sanity/image-url
│   │   └── live.ts          # Live content API
│   ├── env.ts               # Variables de entorno para Sanity
│   └── structure.ts         # Estructura personalizada del Studio
├── middleware.ts             # Detección de idioma y redirección automática
├── next.config.ts
├── tailwind.config.ts
├── sanity.config.ts
└── sanity.cli.ts
```

---

## 5. Rutas y Páginas

Todas las rutas están bajo el segmento dinámico `[lang]` (ej: `/es`, `/en`). El middleware detecta el idioma del navegador y redirige automáticamente.

| Ruta                          | Descripción                                                         |
| :---------------------------- | :------------------------------------------------------------------ |
| `/[lang]`                     | Inicio: Hero de portada + grid asimétrico de colecciones            |
| `/[lang]/coleccion`           | Lista de todas las colecciones maestras                             |
| `/[lang]/coleccion/[slug]`    | Obras de arte de una colección específica, filtradas por `categoryId` |
| `/[lang]/producto/[slug]`     | Detalle de obra: galería, descripción, detalles técnicos, precio, añadir al carrito |
| `/[lang]/el-taller`           | Historia del taller, filosofía y artesanos                          |
| `/[lang]/checkout`            | Formulario de envío e integración con Stripe                        |
| `/[lang]/checkout/success`    | Confirmación de pedido completado (vacía el carrito automáticamente) |
| `/[lang]/cuenta`              | Área privada: perfil e historial de pedidos (ruta protegida)        |
| `/[lang]/auth/signin`         | Inicio de sesión (Google OAuth o acceso de invitado)                |
| `/studio`                     | Sanity Studio embebido (solo para administradores)                  |

---

## 6. Internacionalización (i18n)

El proyecto soporta 5 idiomas sin ninguna dependencia externa de i18n: el sistema está construido sobre el App Router y un middleware propio.

| Código | Idioma   | Bandera  |
| :----- | :------- | :------- |
| `es`   | Español  | 🇪🇸        |
| `en`   | English  | 🇬🇧        |
| `ca`   | Català   | `es-ct`  |
| `eu`   | Euskara  | `es-pv`  |
| `de`   | Deutsch  | 🇩🇪        |

**Flujo completo:**
1. El `middleware.ts` lee el header `Accept-Language` del navegador.
2. Si la URL no incluye un prefijo de idioma válido, redirige a `/{locale}/...` con `NextResponse.redirect` (301 compatible con SEO).
3. Las rutas del Studio (`/studio`), las API (`/api`) y los archivos estáticos quedan excluidos del middleware.
4. El layout `app/[lang]/layout.tsx` carga el diccionario JSON correspondiente y lo inyecta vía `I18nContext`.
5. El `I18nContext` expone `lang` y `dict` a todos los componentes cliente.
6. El contenido dinámico de Sanity tiene un campo `translations` con un objeto clave-valor por idioma.
7. El cambio de idioma en el header preserva la ruta actual, reemplazando únicamente el segmento `[lang]`.

---

## 7. Esquemas de Contenido (Sanity)

### `artwork` — Obras de Arte

| Campo              | Tipo     | Requerido | Descripción                                              |
| :----------------- | :------- | :-------: | :------------------------------------------------------- |
| `internalName`     | string   | ✅         | Identificador interno del taller (no visible en la web)  |
| `slug`             | slug     | ✅         | URL de la obra (generado desde `internalName`)           |
| `kanji`            | string   | —         | Carácter japonés representativo (ej: `行灯`)              |
| `price`            | number   | ✅         | Precio en euros (mínimo 0)                               |
| `category`         | string   | —         | `Meisho` · `Shokutaku` · `Budō` · `Kazaru`              |
| `image`            | image    | ✅         | Fotografía principal (hotspot activado)                  |
| `additionalImages` | image[]  | —         | Galería de hasta 4 imágenes adicionales                  |
| `hoverImage`       | image    | —         | Imagen "iluminada" para el efecto noche en hover         |
| `isSold`           | boolean  | —         | Marca la obra como vendida; la descataloga de la tienda automáticamente. El webhook de Stripe lo activa al confirmar el pago. |
| `allowsPyrography` | boolean  | —         | Indica si el comprador puede solicitar un grabado personalizado por pirografía |
| `translations`     | object   | —         | Nombre público, descripción evocativa y detalles técnicos por idioma |

#### Categorías disponibles

| Valor      | Título completo               |
| :--------- | :---------------------------- |
| `Meisho`   | Meisho — Estructuras y Luz    |
| `Shokutaku`| Shokutaku — Culinario y Té    |
| `Budō`     | Budō — Artes Marciales        |
| `Kazaru`   | Kazaru — Piezas Decorativas   |

### `collection` — Colecciones Maestras

| Campo          | Tipo     | Requerido | Descripción                                                        |
| :------------- | :------- | :-------: | :----------------------------------------------------------------- |
| `internalName` | string   | ✅         | Nombre interno                                                     |
| `categoryId`   | string   | —         | Categoría de obra que filtra esta colección (debe coincidir exactamente con `artwork.category`) |
| `slug`         | slug     | ✅         | URL de la colección                                                |
| `kanji`        | string   | —         | Carácter japonés                                                   |
| `image`        | image    | ✅         | Imagen de portada                                                  |
| `layout`       | string   | ✅         | Peso visual en el grid asimétrico del Home (ver opciones abajo)    |
| `translations` | object   | —         | Título y descripción por idioma                                    |

#### Opciones de `layout`

| Valor en Tailwind                          | Descripción visual        |
| :----------------------------------------- | :------------------------ |
| `md:col-span-8 h-[60vh] md:h-[70vh]`      | Grande — Horizontal       |
| `md:col-span-4 h-[50vh] md:h-[70vh]`      | Mediano — Vertical        |
| `md:col-span-12 h-[40vh] md:h-[50vh]`     | Ancho completo — Panorámico |

### `home` — Página de Inicio

Contiene las imágenes del Hero en formato landscape y mobile, más el copy de bienvenida con traducciones por idioma.

### `workshop` — El Taller

Contenido editorial sobre la filosofía del estudio y los artesanos.

### `order` — Pedidos

Vincula un usuario con las obras compradas, el total y el estado del pedido.

### `user` — Perfil de Usuario

Datos del cliente para el área privada `/cuenta`.

---

## 8. Carrito de Compra

El carrito está gestionado íntegramente en el cliente mediante `CartContext` (React Context API).

- **Persistencia:** El estado del carrito se serializa en `localStorage` bajo la clave `mokuzai_cart`. Al recargar la página, se restaura automáticamente.
- **Estructura de un ítem:** `{ id: string (slug), name: string, price: number, image: string, quantity: number }`.
- **Operaciones:** `addToCart(item)` — añade o incrementa cantidad; `removeFromCart(id)` — elimina por slug; `clearCart()` — vacía el carrito por completo (se invoca automáticamente en `/checkout/success`).
- **Métricas derivadas:** `cartTotal` (suma de `precio × cantidad`) y `cartCount` (número total de unidades).
- **Apertura del drawer:** Cualquier componente puede abrir el `CartDrawer` disparando el evento personalizado `window.dispatchEvent(new Event("openCartDrawer"))`.
- **Badge:** El icono del carrito en el header muestra un punto de color `#A08963` cuando `cartCount > 0`.

---

## 9. Rutas de API

Todos los endpoints están bajo `app/api/`.

| Endpoint              | Método(s)    | Descripción                                                                                  |
| :-------------------- | :----------- | :------------------------------------------------------------------------------------------- |
| `/api/auth/[...nextauth]` | GET, POST | Endpoints automáticos de NextAuth (login, logout, sesión).                               |
| `/api/checkout`       | POST, PATCH  | **POST:** crea un `PaymentIntent` en Stripe con el carrito y el email del usuario. **PATCH:** actualiza el email del cliente en los metadatos del `PaymentIntent`. |
| `/api/webhook`        | POST         | Webhook de Stripe. Verifica la firma, registra el pedido en Sanity, marca cada obra como `isSold: true` y envía emails de confirmación al cliente y al administrador vía Nodemailer. Requiere la variable `STRIPE_WEBHOOK_SECRET`. |
| `/api/user`           | GET          | Devuelve los datos del usuario autenticado y la última dirección de envío registrada en Sanity. Requiere sesión activa (401 si no). |

---

## 10. Autenticación

La autenticación se gestiona con **NextAuth.js v4** y está configurada en `lib/auth.ts`.

### Proveedores activos

| Proveedor       | Descripción                                          |
| :-------------- | :--------------------------------------------------- |
| **Google OAuth** | Login con cuenta de Google. Requiere `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en Vercel. |
| **Credentials** | Proveedor de invitado para desarrollo/pruebas. Cualquier intento de login devuelve un usuario ficticio. |

### Flujo

1. El usuario accede a `/[lang]/auth/signin`.
2. Selecciona el método de autenticación.
3. NextAuth gestiona la sesión con JWT (por defecto).
4. El hook `useSession()` de NextAuth expone los datos de sesión a todos los componentes cliente.
5. El header muestra el primer nombre del usuario autenticado y redirige el icono de cuenta a `/cuenta` en vez de `/auth/signin`.

> ⚠️ El proveedor `Credentials` de invitado es **exclusivo para desarrollo**. Debe desactivarse antes de pasar a producción.

---

## 11. Gestión de Activos y Fotografía

La tasa de conversión depende de la calidad visual de piezas únicas.

- Todas las imágenes se sirven a través del **CDN de Sanity** con el helper `urlFor()` de `@sanity/image-url`.
- El formato de salida recomendado es **WebP** para garantizar el LCP óptimo sin perder la nitidez de la veta.
- Se usa el componente `<Image />` nativo de Next.js con los atributos de optimización activados.
- Cada obra dispone de hasta **6 imágenes**: `image` (principal), `additionalImages` (galería, máx. 4) y `hoverImage` (noche iluminada). Todas tienen hotspot activado para el recorte inteligente.
- El audio de atmósfera se almacena en `/public/mokuzai-ambient.mp3` como activo estático y se reproduce en bucle a volumen `0.2`.

---

## 12. Guía de Instalación

### Requisitos Previos

- Node.js 18+
- npm 9+
- Cuenta en [Sanity.io](https://sanity.io) con un proyecto creado
- Cuenta en [Stripe](https://stripe.com) (modo test para desarrollo)
- Proyecto en [Google Cloud Console](https://console.cloud.google.com) con OAuth 2.0 configurado (para login con Google)

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/davidValades/Mokuzai-art.git
cd Mokuzai-art

# 2. Instala las dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env.local
# → Edita .env.local con las claves de tu equipo (ver sección 12)

# 4. Inicia el servidor de desarrollo
npm run dev
```

Accede a [http://localhost:3000](http://localhost:3000) para ver la tienda.  
Accede a [http://localhost:3000/studio](http://localhost:3000/studio) para administrar el contenido en Sanity Studio.

---

## 13. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables. Solicita los valores al líder del equipo.

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_API_WRITE_TOKEN=        # Token con permisos de escritura para el webhook (crear pedidos y marcar obras como vendidas)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=         # Secreto del endpoint de webhook en el Dashboard de Stripe

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Google OAuth (para login con Google en NextAuth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email transaccional (Nodemailer / SMTP)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false              # true para puerto 465 (SSL)
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=davidmokuzaiart@gmail.com   # Email del administrador para notificaciones de nuevos pedidos
```

> ⚠️ **Nunca** subas `.env.local` al repositorio. Está incluido en `.gitignore`.
>
> `NEXTAUTH_SECRET` puede generarse con: `openssl rand -base64 32`
>
> Para pruebas locales del webhook de Stripe, utiliza la CLI de Stripe: `stripe listen --forward-to localhost:3000/api/webhook`

---

## 14. Scripts Disponibles

| Comando         | Descripción                                         |
| :-------------- | :-------------------------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo en `localhost:3000` |
| `npm run build` | Genera la build de producción optimizada            |
| `npm run start` | Sirve la build de producción localmente             |
| `npm run lint`  | Ejecuta ESLint sobre toda la base de código         |

---

## 15. Despliegue

La rama `main` está conectada directamente a **Vercel**.

- Cada **Pull Request** genera un entorno de Preview automáticamente con URL única.
- Una vez aprobado el Code Review, el merge a `main` desencadena un despliegue en producción.
- Las variables de entorno de producción se configuran en el panel de Vercel, **no** en el repositorio.
- El dominio de producción debe actualizarse en `NEXTAUTH_URL` y en la configuración de OAuth de Google.

Solo se aceptan commits que respeten la filosofía de **lujo silencioso** en el frontend y la máxima eficiencia en el backend.

---

## 16. Contribuir

1. Trabaja siempre en una rama nueva: `git checkout -b feat/nombre-de-la-mejora`.
2. Asegúrate de que `npm run lint` pasa sin errores antes de hacer commit.
3. Abre un Pull Request contra `main` con una descripción clara del cambio.
4. El PR generará un entorno de Preview en Vercel para revisión visual.
5. Tras la aprobación del equipo, el merge se realiza con **Squash and Merge**.

### Convenciones de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: añade galería de imágenes adicionales en detalle de producto
fix: corrige selector de idioma en mobile
docs: actualiza README con variables de entorno de Google OAuth
style: ajusta espaciado del CartDrawer en tablet
refactor: extrae lógica del carrito a hook personalizado
```

---

<p align="center">
  <em>木材 — Mokuzai Art · El alma de la madera · © 2026 Crafted with Dedication</em>
</p>
