{
  "repo_notes": [
    {
      "content": ""
    }
  ],
  "pages": [
    {
      "title": "Mokuzai Art — Project Overview",
      "purpose": "High-level introduction to the Mokuzai Art web application: its purpose as a headless e-commerce gallery for unique handcrafted wooden artworks, the overall tech stack (Next.js App Router, Sanity CMS, Stripe, NextAuth), and the Japandi/minimalist design philosophy. Links to all major child sections.",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Getting Started & Local Development",
      "purpose": "Step-by-step guide for cloning the repo, installing dependencies, configuring environment variables (Sanity, Stripe, NextAuth, SMTP, Google OAuth), running the dev server, and accessing the embedded Sanity Studio at /studio.",
      "parent": "Mokuzai Art — Project Overview",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Design System & Brand Tokens",
      "purpose": "Documents the Japandi/Mokuzai visual language: the four Tailwind color tokens (stone-serene, olive-dark, earth-noble, wood-light), typography (Cormorant Garamond + Inter), CSS variable injection, noise texture overlay, and the Ma (negative space) principle applied throughout the UI.",
      "parent": "Mokuzai Art — Project Overview",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Application Architecture",
      "purpose": "Overview of the Next.js App Router structure, the server/client component split, global context providers, middleware-based i18n routing, and how data flows from Sanity CMS through server components to client components. Links to child pages for each major subsystem.",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Routing & Middleware",
      "purpose": "Explains the [lang] dynamic segment, how middleware.ts detects the browser's Accept-Language header and redirects to the correct locale prefix, which paths are excluded (studio, api, static files), and the full route table for all pages.",
      "parent": "Application Architecture",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Global Providers & Context",
      "purpose": "Details the nested provider pattern in RootLayout: AuthProvider (NextAuth), I18nProvider (lang + dict), and CartProvider. Covers the I18nContext (useI18n hook), CartContext (useCart hook, localStorage persistence, CartItem shape, clearCart), and the Providers.tsx SessionProvider wrapper.",
      "parent": "Application Architecture",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "SEO, Sitemap & Robots",
      "purpose": "Covers the Next.js Metadata API usage in layout.tsx and page-level generateMetadata, canonical/alternate links for all five locales, OpenGraph/Twitter cards, JSON-LD structured data (Product + BreadcrumbList schemas), the dynamic sitemap.ts, and robots.ts access rules.",
      "parent": "Application Architecture",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Internationalization (i18n)",
      "purpose": "Overview of the custom dictionary-based i18n system supporting five languages (es, en, ca, eu, de) with no external i18n library. Summarizes the full flow from middleware detection to dictionary loading to client-side consumption, and links to child pages for the dictionary schema and content translation strategy.",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Dictionary Schema & Localization Keys",
      "purpose": "Documents the structure of the JSON dictionary files (es, en, ca, eu, de), the key namespaces (navigation, home, product, cart, checkout, dashboard, cookies, footer, signin), the getDictionary() utility, the Locale type, and the fallback chain (requested lang → es).",
      "parent": "Internationalization (i18n)",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Content Translation in Sanity",
      "purpose": "Explains how dynamic content (artwork names, descriptions, collection titles, workshop copy, hero text) is stored in Sanity's translations object keyed by language code, how server components merge CMS translations with the dictionary, and the fallback strategy for missing translations.",
      "parent": "Internationalization (i18n)",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Content Management System (Sanity)",
      "purpose": "Overview of the headless CMS architecture: Sanity project setup, the embedded Studio at /studio, the GROQ query pattern, the serverClient vs. read-only client distinction, and links to child pages covering each schema type.",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Artwork & Collection Schemas",
      "purpose": "Deep dive into the artwork schema (internalName, slug, kanji, price, category, image/additionalImages/hoverImage, isSold, allowsPyrography, buyer reference, translations) and the collection schema (categoryId, layout grid options, translations). Covers the four artwork categories: Meisho, Shokutaku, Budō, Kazaru.",
      "parent": "Content Management System (Sanity)",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Order & User Schemas",
      "purpose": "Documents the order schema (orderNumber, customerName/Email, items array with artworkRef/artworkSlug/imageUrl, totalAmount, status lifecycle, shippingAddress) and the user schema (name, email, image, role, purchases array). Explains how the webhook populates these documents after payment.",
      "parent": "Content Management System (Sanity)",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Sanity Client, Image Pipeline & Live API",
      "purpose": "Covers the two Sanity client instances (read-only client in lib/sanity.ts and write-capable serverClient), the urlFor() helper from @sanity/image-url, hotspot/crop usage for focal-point-aware image rendering, CDN delivery via cdn.sanity.io, and the live content API in sanity/lib/live.ts.",
      "parent": "Content Management System (Sanity)",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Frontend Pages & Components",
      "purpose": "Overview of the main UI pages and shared components, covering the server/client split pattern used throughout. Links to child pages for the gallery, product detail, workshop, and shared UI components.",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Home Page & Collections Grid",
      "purpose": "Documents the home page server component (GROQ query for home + collection documents), the Hero component (landscape/mobile images, parallax, animated tagline), and the CollectionsGrid component (asymmetric CSS grid driven by the layout field, hotspot objectPosition, framer-motion whileInView animations, categoryId-based navigation links).",
      "parent": "Frontend Pages & Components",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Collection Gallery & Product Detail",
      "purpose": "Covers the AllCollectionsPage server component, CollectionClient (category filter tabs, URL sync via searchParams, resolveFilter normalization, isSold overlay, hoverImage day/night effect), ProductCard (staggered animation, hover image), and ProductDetailClient (parallax hero, lightbox, pyrography personalization, floating purchase bar, handleAddToCart/handleDirectBuy workflow).",
      "parent": "Frontend Pages & Components",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Header, Navigation & Ambient Audio",
      "purpose": "Documents the Header component: scroll-driven height/background animation, dark-hero page detection, language switcher (LANGUAGES_CONFIG, switchLanguage regex), ambient audio system (toggleAudio, audioRef, lazy init, volume 0.2, loop, visualizer bars), CartDrawer trigger via openCartDrawer window event, mobile hamburger overlay, and responsive breakpoints.",
      "parent": "Frontend Pages & Components",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Workshop (El Taller) Page",
      "purpose": "Describes the El Taller page: server component fetching the workshop Sanity document, WorkshopClient with chiaroscuro hero (light/dark image hover transition), parallax scroll, Shokunin (Ricardo) biography section, detail image with grayscale hover, and CTA linking to the collection.",
      "parent": "Frontend Pages & Components",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "E-Commerce & Payment Flow",
      "purpose": "Overview of the complete purchase funnel from cart to confirmed order: CartContext state management, CartDrawer UI, checkout form with Stripe Elements, webhook-based order fulfillment, and the success page. Links to child pages for each stage.",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Shopping Cart",
      "purpose": "Details the CartContext (CartItem shape including pyrographyText, addToCart/removeFromCart/clearCart, localStorage persistence under mokuzai_cart key, cartTotal/cartCount derived values) and the CartDrawer component (slide-in animation, free shipping threshold display, GA4 begin_checkout event, routing to checkout).",
      "parent": "E-Commerce & Payment Flow",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Checkout & Stripe Integration",
      "purpose": "Covers the checkout page (session guard, redirect to signin), CheckoutForm (Stripe Elements initialization, custom appearance engine, guest email PATCH flow, shipping address pre-fill from /api/user, confirmPayment lifecycle), and the POST/PATCH /api/checkout route (PaymentIntent creation, EUR currency, product_slugs metadata, setup_future_usage).",
      "parent": "E-Commerce & Payment Flow",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Webhook & Order Fulfillment",
      "purpose": "Documents the POST /api/webhook route: Stripe signature verification, payment_intent.succeeded handling, metadata reconciliation (product_slugs → artwork lookups), Sanity mutations (isSold patch, order document creation, user purchases append), dual transactional email dispatch (customer + admin via Nodemailer), and error handling strategy (critical vs. non-critical failures).",
      "parent": "E-Commerce & Payment Flow",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Order Success & Analytics",
      "purpose": "Describes the /checkout/success page (cart clearance via clearCart, order confirmation display), and the analytics module (lib/analytics.ts): gaAddToCart, gaRemoveFromCart, gaBeginCheckout, gaPurchase functions wrapping sendGAEvent with EUR currency and item arrays, plus Vercel Analytics integration.",
      "parent": "E-Commerce & Payment Flow",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Authentication & User Account",
      "purpose": "Overview of the NextAuth.js v4 authentication system, the Collectors private area, and the user API. Links to child pages for auth configuration and the dashboard.",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "NextAuth Configuration & Sign-In",
      "purpose": "Details lib/auth.ts (Google OAuth provider, Credentials guest provider for dev, signIn callback that auto-creates Sanity user documents, JWT session strategy), the /api/auth/[...nextauth] route handler, the custom sign-in page at /[lang]/auth/signin, and the Providers.tsx SessionProvider wrapper.",
      "parent": "Authentication & User Account",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Collector Dashboard & User API",
      "purpose": "Documents the /[lang]/cuenta page (server-side session guard, order history GROQ query), DashboardClient component (order list with artwork thumbnails, status badges, signOut button, empty state), and the GET /api/user route (returns authenticated user data and last shipping address from Sanity for checkout pre-fill).",
      "parent": "Authentication & User Account",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Infrastructure & Tooling",
      "purpose": "Overview of the project's build tooling, deployment pipeline, and static assets. Links to child pages for configuration files and public assets.",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Build Configuration & Deployment",
      "purpose": "Covers next.config.ts (remote image hostname whitelist for cdn.sanity.io), tsconfig.json path aliases (@/ mapping), eslint.config.mjs, postcss.config.mjs, the Vercel deployment pipeline (main branch auto-deploy, PR preview environments), and available npm scripts (dev, build, start, lint).",
      "parent": "Infrastructure & Tooling",
      "page_notes": [
        {
          "content": ""
        }
      ]
    },
    {
      "title": "Public Assets & PWA Manifest",
      "purpose": "Documents the /public directory contents: favicon set (favicon.ico, favicon.svg, favicon-96x96.png, apple-touch-icon.png), PWA manifest (site.webmanifest, web-app-manifest-192x192.png, web-app-manifest-512x512.png), og-image.jpg for social sharing, mokuzai-ambient.mp3 ambient audio file, and Google Search Console verification file.",
      "parent": "Infrastructure & Tooling",
      "page_notes": [
        {
          "content": ""
        }
      ]
    }
  ]
}
