import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad y cookies de Mokuzai Art. Conoce cómo tratamos tus datos personales y qué tipos de cookies utilizamos.",
};

const LAST_UPDATED = "4 de mayo de 2026";
const CONTACT_EMAIL = "privacidad@mokuzai-art.es";
const BASE_URL = "https://mokuzai-art.es";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main className="min-h-screen bg-[#DBDBDB] pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Cabecera */}
        <div className="mb-16 text-center">
          <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-[#A08963] mb-4">
            {LAST_UPDATED}
          </p>
          <h1 className="font-cormorant text-5xl md:text-6xl tracking-widest uppercase text-[#706D54] mb-6">
            Política de Privacidad
          </h1>
          <div className="w-16 h-px bg-[#706D54]/30 mx-auto" />
        </div>

        {/* Contenido */}
        <div className="space-y-12 font-inter text-sm text-[#706D54]/80 leading-relaxed">
          <Section title="1. Responsable del tratamiento">
            <p>
              <strong className="text-[#706D54]">Responsable:</strong> Mokuzai
              Art
            </p>
            <p>
              <strong className="text-[#706D54]">Web:</strong>{" "}
              <a
                href={BASE_URL}
                className="underline hover:text-[#A08963] transition-colors"
              >
                {BASE_URL}
              </a>
            </p>
            <p>
              <strong className="text-[#706D54]">Contacto:</strong>{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline hover:text-[#A08963] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>

          <Section title="2. Datos que recogemos">
            <p>
              Mokuzai Art recoge únicamente los datos estrictamente necesarios
              para prestar el servicio:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li>
                <strong>Datos de pedido:</strong> nombre, dirección de envío y
                correo electrónico, para gestionar y entregar tu compra.
              </li>
              <li>
                <strong>Datos de cuenta:</strong> correo y contraseña (cifrada)
                si creas una cuenta en nuestra galería.
              </li>
              <li>
                <strong>Datos de navegación (analíticos):</strong> con tu
                consentimiento previo, recogemos datos anónimos de uso mediante
                Google Analytics 4 para mejorar la experiencia.
              </li>
            </ul>
          </Section>

          <Section title="3. Finalidad y base legal">
            <table className="w-full text-xs border-collapse mt-2">
              <thead>
                <tr className="border-b border-[#706D54]/20">
                  <th className="text-left py-2 pr-4 text-[#706D54] font-medium tracking-wider uppercase">
                    Finalidad
                  </th>
                  <th className="text-left py-2 text-[#706D54] font-medium tracking-wider uppercase">
                    Base legal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#706D54]/10">
                <tr>
                  <td className="py-2 pr-4">Gestión de pedidos</td>
                  <td className="py-2">Ejecución de contrato (art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Gestión de cuenta de usuario</td>
                  <td className="py-2">Ejecución de contrato (art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Analítica web</td>
                  <td className="py-2">Consentimiento (art. 6.1.a RGPD)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Marketing y publicidad</td>
                  <td className="py-2">Consentimiento (art. 6.1.a RGPD)</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section title="4. Política de cookies">
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu
              dispositivo. Utilizamos los siguientes tipos:
            </p>
            <div className="space-y-4 mt-4">
              <CookieBlock
                name="Cookies necesarias"
                always
                description="Imprescindibles para el funcionamiento básico del sitio web (gestión de sesión, carrito de compra, preferencias de idioma). No requieren consentimiento."
                examples="Sesión NextAuth, preferencias de idioma"
              />
              <CookieBlock
                name="Cookies analíticas"
                description="Nos permiten entender de forma anónima cómo los visitantes navegan por la galería, qué obras despiertan más interés y mejorar la experiencia."
                examples="Google Analytics 4 (_ga, _ga_*)"
                provider="Google LLC (EE. UU.) — transferencia bajo SCCs"
              />
              <CookieBlock
                name="Cookies de marketing"
                description="Utilizadas para mostrarte contenido relevante y anuncios personalizados en otras plataformas, basados en tu navegación en nuestra galería."
                examples="Google Ads, Meta Pixel (si se activan)"
                provider="Google LLC / Meta Platforms (EE. UU.)"
              />
            </div>
            <p className="mt-4">
              Puedes gestionar tus preferencias de cookies en cualquier momento
              desde el panel que aparece al pie de la página, o bien desde la
              configuración de tu navegador.
            </p>
          </Section>

          <Section title="5. Transferencias internacionales">
            <p>
              Algunos de nuestros proveedores (como Google Analytics) están
              ubicados fuera del Espacio Económico Europeo. Estas transferencias
              se realizan bajo las Cláusulas Contractuales Estándar aprobadas
              por la Comisión Europea, garantizando un nivel de protección
              equivalente al exigido por el RGPD.
            </p>
          </Section>

          <Section title="6. Conservación de los datos">
            <ul className="list-disc list-inside space-y-1">
              <li>Datos de pedido: 5 años (obligación fiscal).</li>
              <li>
                Datos de cuenta: hasta que solicites su supresión o cierres tu
                cuenta.
              </li>
              <li>
                Datos analíticos: 14 meses (retención estándar de Google
                Analytics 4).
              </li>
            </ul>
          </Section>

          <Section title="7. Tus derechos">
            <p>
              En virtud del RGPD y la LOPDGDD tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li>
                <strong>Acceso:</strong> conocer qué datos tenemos sobre ti.
              </li>
              <li>
                <strong>Rectificación:</strong> corregir datos inexactos.
              </li>
              <li>
                <strong>Supresión:</strong> solicitar el borrado de tus datos.
              </li>
              <li>
                <strong>Oposición y limitación:</strong> restringir el
                tratamiento en determinados supuestos.
              </li>
              <li>
                <strong>Portabilidad:</strong> recibir tus datos en formato
                estructurado.
              </li>
              <li>
                <strong>Retirada del consentimiento:</strong> en cualquier
                momento, sin que afecte a la licitud del tratamiento previo.
              </li>
            </ul>
            <p className="mt-4">
              Para ejercer tus derechos escríbenos a{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline hover:text-[#A08963] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              . Si no obtienes respuesta satisfactoria, puedes reclamar ante la{" "}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#A08963] transition-colors"
              >
                Agencia Española de Protección de Datos (AEPD)
              </a>
              .
            </p>
          </Section>

          <Section title="8. Seguridad">
            <p>
              Aplicamos medidas técnicas y organizativas para proteger tus datos
              frente a accesos no autorizados, pérdida o destrucción. Los pagos
              son gestionados íntegramente por Stripe y nunca almacenamos datos
              bancarios en nuestros servidores.
            </p>
          </Section>

          <Section title="9. Cambios en esta política">
            <p>
              Podemos actualizar esta política para adaptarla a cambios
              normativos o en nuestros servicios. Te informaremos de cambios
              sustanciales mediante un aviso en la web. La fecha de la última
              actualización figura al inicio de esta página.
            </p>
          </Section>
        </div>

        {/* Volver */}
        <div className="mt-16 text-center">
          <Link
            href={`/${lang}`}
            className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#706D54]/60 hover:text-[#706D54] transition-colors border border-[#706D54]/30 px-8 py-4 inline-block"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-cormorant text-2xl tracking-widest uppercase text-[#706D54] mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function CookieBlock({
  name,
  always = false,
  description,
  examples,
  provider,
}: {
  name: string;
  always?: boolean;
  description: string;
  examples: string;
  provider?: string;
}) {
  return (
    <div className="border border-[#706D54]/15 p-4 space-y-2">
      <div className="flex items-center gap-3">
        <span className="font-inter text-[10px] tracking-[0.15em] uppercase text-[#706D54] font-medium">
          {name}
        </span>
        {always && (
          <span className="font-inter text-[9px] tracking-[0.15em] uppercase bg-[#706D54]/10 text-[#706D54] px-2 py-0.5">
            Siempre activas
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed">{description}</p>
      <p className="text-xs text-[#706D54]/50">
        <strong>Ejemplos:</strong> {examples}
      </p>
      {provider && (
        <p className="text-xs text-[#706D54]/50">
          <strong>Proveedor:</strong> {provider}
        </p>
      )}
    </div>
  );
}
