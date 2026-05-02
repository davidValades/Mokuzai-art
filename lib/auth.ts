// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // Añadimos esto

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Añadimos este proveedor temporal para poder probar el login
    CredentialsProvider({
      name: "Invitado",
      credentials: {},
      async authorize(credentials) {
        // Simulamos un login exitoso con un usuario "fake"
        return {
          id: "1",
          name: "Coleccionista Mokuzai",
          email: "coleccionista@mokuzaiart.com",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
};
