import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OnboardingForm } from "@/components/auth/onboarding-form";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await db.user.findUnique({
    where:{ id:session.user.id },
    select:{ onboardingCompletedAt:true, objetivoDeclarado:true, nivelInicialDeclarado:true, nombre:true }
  });
  if (!user) redirect("/login");
  if (user.onboardingCompletedAt) redirect("/dashboard");

  return <main className="mx-auto flex min-h-screen max-w-2xl items-center px-5 py-12">
    <OnboardingForm name={user.nombre} />
  </main>;
}
