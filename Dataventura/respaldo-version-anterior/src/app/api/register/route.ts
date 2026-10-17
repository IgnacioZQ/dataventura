import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { clientIp, consumeRateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validation";

const GENERIC_ERROR = "No fue posible crear la cuenta con esos datos.";

export async function POST(request: Request) {
  const allowed = await consumeRateLimit(`register:ip:${clientIp(request.headers)}`, 10, 60 * 60);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiados intentos. Espera unos minutos y vuelve a probar." }, { status: 429 });
  }

  const json: unknown = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa nombre, correo y contraseña. Usa al menos 12 caracteres." }, { status: 400 });
  }

  // Correo ya registrado: respuesta genérica, sin revelar si la cuenta existe.
  const existing = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (existing) return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  try {
    const user = await db.user.create({
      data: { email: parsed.data.email, nombre: parsed.data.nombre, passwordHash },
      select: { id: true }
    });
    await db.analyticsEvent.create({
      data: { userId: user.id, event: "user_registered", properties: { method: "credentials" } }
    });
  } catch (cause) {
    // Dos registros simultáneos con el mismo correo: gana el primero.
    if (cause instanceof Prisma.PrismaClientKnownRequestError && cause.code === "P2002") {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }
    throw cause;
  }

  return NextResponse.json({ created: true }, { status: 201 });
}
