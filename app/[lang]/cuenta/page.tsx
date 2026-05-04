import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/sanity";
import { authOptions } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function AccountPage({
  params,
}: {
  params: { lang: string };
}) {
  const session = await getServerSession(authOptions);

  // Si no hay sesión, protegemos la ruta redirigiendo al home o login
  if (!session) {
    redirect(`/${params.lang}`);
  }

  // Traemos los pedidos de este usuario desde Sanity (sin CDN para datos en tiempo real)
  const query = `*[_type == "order" && customerEmail == $email] | order(_createdAt desc)`;
  const orders = await serverClient.fetch(query, { email: session.user?.email });

  return (
    <main className="min-h-screen bg-[#DBDBDB]">
      <DashboardClient session={session} orders={orders} lang={params.lang} />
    </main>
  );
}
