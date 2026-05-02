import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity";
import DashboardClient from "./DashboardClient";

export default async function AccountPage({
  params,
}: {
  params: { lang: string };
}) {
  const session = await getServerSession();

  // Si no hay sesión, protegemos la ruta redirigiendo al home o login
  if (!session) {
    redirect(`/${params.lang}`);
  }

  // Traemos los pedidos de este usuario desde Sanity
  const query = `*[_type == "order" && customerEmail == $email] | order(_createdAt desc)`;
  const orders = await client.fetch(query, { email: session.user?.email });

  return (
    <main className="min-h-screen bg-[#DBDBDB]">
      <DashboardClient session={session} orders={orders} lang={params.lang} />
    </main>
  );
}
