"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    setLoading(false);

    if (result?.error) {
      setError("No se ha podido iniciar sesion. Revisa tus credenciales.");
      return;
    }

    window.location.href = result?.url ?? "/";
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-8 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
          Acceso agricultor
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Entrar en Palleter
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Base de autentificacion con email y contraseña para el panel privado.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-medium">Email</span>
          <input
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Contraseña</span>
          <input
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-strong)] px-5 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
