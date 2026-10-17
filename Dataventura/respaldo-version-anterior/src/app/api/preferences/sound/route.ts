import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const soundPreferenceSchema = z.object({ enabled: z.boolean() });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Inicia sesión para guardar esta preferencia." }, { status: 401 });
  }

  const payload: unknown = await request.json().catch(() => null);
  const parsed = soundPreferenceSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "La preferencia de audio no es válida." }, { status: 400 });
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { soundEnabled: parsed.data.enabled }
  });

  return NextResponse.json({ enabled: parsed.data.enabled });
}
