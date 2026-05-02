import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // Esto es vital para que NextAuth sepa dónde enviar al usuario
  /*pages: {
    signIn: "/auth/signin", // Opcional: una página de login Zen más adelante
    error: "/auth/error",
  },*/
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
};
