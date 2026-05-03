import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { client } from "@/lib/sanity";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Fetch the most recent order for this user to pre-fill the shipping address
  const query = `*[_type == "order" && customerEmail == $email] | order(_createdAt desc) [0] { shippingAddress }`;
  const lastOrder = await client.fetch(query, { email: session.user.email });

  return NextResponse.json({
    user: {
      address: lastOrder?.shippingAddress ?? "",
    },
  });
}
