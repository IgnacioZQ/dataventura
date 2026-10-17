import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error:"Inicia sesión para guardar tu perfil." }, { status:401 });

  const payload: unknown = await request.json().catch(() => null);
  const parsed = onboardingSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error:"Selecciona un objetivo y un nivel válidos." }, { status:400 });

  await db.$transaction([
    db.user.update({
      where:{ id:session.user.id },
      data:{
        objetivoDeclarado:parsed.data.objetivoDeclarado,
        nivelInicialDeclarado:parsed.data.nivelInicial,
        onboardingCompletedAt:new Date()
      }
    }),
    db.analyticsEvent.create({
      data:{
        userId:session.user.id,
        event:"onboarding_completed",
        properties:parsed.data
      }
    })
  ]);

  return NextResponse.json({ completed:true }, { status:200 });
}
