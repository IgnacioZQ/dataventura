import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";
import { clientIp, consumeRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

class RateLimitedSignin extends CredentialsSignin {
  code = "rate_limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Correo y contraseña",
      credentials: {
        email: { label: "Correo electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const byEmail = await consumeRateLimit(`login:email:${parsed.data.email}`, 8, 10 * 60);
        const byIp = await consumeRateLimit(`login:ip:${clientIp(request.headers)}`, 40, 10 * 60);
        if (!byEmail || !byIp) throw new RateLimitedSignin();

        const user = await db.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.passwordHash) return null;

        const verified = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!verified) return null;

        return { id: user.id, name: user.nombre, email: user.email, role: user.role as Role };
      }
    })
  ]
});
