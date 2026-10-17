import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { GameError, submitAnswer } from "@/lib/sessions";

const answerSchema = z.object({
  challengeId: z.string().min(1).max(64),
  answer: z.union([z.string().max(64), z.number().finite(), z.array(z.string().max(64)).max(8)]),
  day: z.string().max(10).optional()
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Inicia sesión para guardar tu progreso." }, { status: 401 });
  }

  const parsed = answerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "La respuesta enviada no es válida." }, { status: 400 });
  }

  try {
    const { id } = await context.params;
    const result = await submitAnswer({
      userId: session.user.id,
      sessionId: id,
      challengeId: parsed.data.challengeId,
      rawAnswer: parsed.data.answer,
      clientDay: parsed.data.day
    });
    return NextResponse.json(result);
  } catch (cause) {
    if (cause instanceof GameError) return NextResponse.json({ error: cause.message }, { status: cause.status });
    throw cause;
  }
}
