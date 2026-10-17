import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

// Configuración sin acceso a base de datos: la usa también el proxy (src/proxy.ts).
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: Role }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        if (token.role) session.user.role = token.role as Role;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;
