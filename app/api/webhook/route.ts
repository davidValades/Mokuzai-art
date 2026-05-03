import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Implementar Webhook de Stripe cuando tengamos las API Keys
  return NextResponse.json({ message: "Webhook en construcción" });
}
