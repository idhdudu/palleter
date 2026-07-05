"use client";

import { useActionState } from "react";
import { Role } from "@prisma/client";
import { registerFarmerAction, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(
    registerFarmerAction,
    initialState,
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-6 py-12">
      <form
        action={formAction}
        className="w-full rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-8 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
          Registro agricultor
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Crear cuenta en Palleter
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Crea una cuenta de agricultor para publicar productos y gestionar disponibilidad.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-medium">Nombre</span>
          <input
            name="name"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Teléfono</span>
          <input
            name="phone"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Contraseña</span>
          <input
            name="password"
            type="password"
            minLength={8}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            required
          />
        </label>

        <input type="hidden" name="role" value={Role.AGRICULTOR} />

        {state.error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-strong)] px-5 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </main>
  );
}
