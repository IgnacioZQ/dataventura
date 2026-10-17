import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { GameError, startIslandSession, startReviewSession } from "@/lib/sessions";

const startSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("ISLAND"), islandSlug: z.string().min(1).max(64) }),
  z.object({ kind: z.literal("REVIEW") })
]);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Inicia sesión para jugar." }, { status: 401 });
  }

  const parsed = startSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "No pudimos iniciar esta sesión." }, { status: 400 });
  }

  try {
    const started = parsed.data.kind === "ISLAND"
      ? await startIslandSession(session.user.id, parsed.data.islandSlug)
      : await startReviewSession(session.user.id);
    return NextResponse.json(started, { status: 201 });
  } catch (cause) {
    if (cause instanceof GameError) return NextResponse.json({ error: cause.message }, { status: cause.status });
    throw cause;
  }
}
