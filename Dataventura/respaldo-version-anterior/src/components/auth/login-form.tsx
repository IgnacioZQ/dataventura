"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
      callbackUrl: "/dashboard"
    });
    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
      setBusy(false);
      return;
    }
    window.location.assign(result?.url ?? "/dashboard");
  }

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-2xl sm:p-10">
      <p className="text-sm uppercase tracking-[0.2em] text-violet">Bienvenida/o de vuelta</p>
      <h1 className="mt-3 text-3xl font-semibold">Inicia sesión</h1>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        <label className="block text-sm">Correo electrónico
          <input className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3" name="email" required type="email" autoComplete="email" />
        </label>
        <label className="block text-sm">Contraseña
          <input className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3" name="password" required type="password" autoComplete="current-password" />
        </label>
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <button className="w-full rounded-xl bg-violet px-5 py-3 font-semibold text-void disabled:opacity-50" disabled={busy}>
          {busy ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>
      <p className="mt-5 text-sm text-white/60">¿Primera vez? <Link className="text-violet underline" href="/register">Crea tu cuenta</Link></p>
    </section>
  );
}
