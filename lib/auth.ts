// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // Añadimos esto
import { serverClient } from "@/lib/sanity";

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
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existing = await serverClient.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: user.email }
          );
          if (!existing) {
            await serverClient.create({
              _type: "user",
              name: user.name ?? "",
              email: user.email,
              image: user.image ?? "",
              role: "cliente",
            });
          }
        } catch (err) {
          console.error("Error al guardar usuario en Sanity:", err);
        }
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    },
  },
};
