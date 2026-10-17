"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nombre: form.get("nombre"),
        email: form.get("email"),
        password: form.get("password")
      })
    });
    const result: { error?: string } = await response.json();
    if (!response.ok) {
      setError(result.error ?? "No fue posible crear la cuenta.");
      setBusy(false);
      return;
    }
    await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      callbackUrl: "/onboarding"
    });
  }

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-2xl sm:p-10">
      <p className="text-sm uppercase tracking-[0.2em] text-violet">Tu primera travesía</p>
      <h1 className="mt-3 text-3xl font-semibold">Crea tu cuenta</h1>
      <p className="mt-2 text-sm text-lavender">Una cuenta segura para guardar tu progreso.</p>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        <label className="block text-sm">Nombre
          <input className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3" name="nombre" required minLength={2} maxLength={80} autoComplete="name" />
        </label>
        <label className="block text-sm">Correo electrónico
          <input className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3" name="email" required type="email" autoComplete="email" />
        </label>
        <label className="block text-sm">Contraseña
          <input className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3" name="password" required type="password" minLength={12} maxLength={128} autoComplete="new-password" />
          <span className="mt-1 block text-xs text-white/50">Mínimo 12 caracteres.</span>
        </label>
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <button className="w-full rounded-xl bg-violet px-5 py-3 font-semibold text-void disabled:opacity-50" disabled={busy}>
          {busy ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-5 text-sm text-white/60">¿Ya tienes cuenta? <Link className="text-violet underline" href="/login">Inicia sesión</Link></p>
    </section>
  );
}
