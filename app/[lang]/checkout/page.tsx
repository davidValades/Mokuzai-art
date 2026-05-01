import { getDictionary, Locale } from "@/lib/dictionary";
import CheckoutForm from "./CheckoutForm"; // <-- Asegúrate de que este import sea así

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="min-h-screen bg-[#DBDBDB] pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <span className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#A08963] mb-4 block">
            Finalizar Pedido
          </span>
          <h1 className="font-cormorant text-5xl text-[#706D54]">
            {dict.checkout.guest_title}
          </h1>
        </header>

        <CheckoutForm dict={dict} lang={lang} />
      </div>
    </main>
  );
}
