"use client";

import { useActionState } from "react";
import LogoMark from "@/components/LogoMark";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <main className="flex min-h-svh items-center justify-center bg-black px-4">
      <form action={formAction} className="w-full max-w-sm">
        <div className="flex items-center gap-2">
          <LogoMark square="hsl(55, 100%, 50%)" glyph="#000000" />
          <span className="display text-xl font-semibold text-white uppercase">TEKTON</span>
        </div>
        <h1 className="display mt-8 text-header-sm text-white">Site Editor</h1>
        <p className="mt-2 text-sm text-gray-on-dark-2">
          Enter the admin password to edit website content.
        </p>
        <label className="mt-8 block">
          <span className="eyebrow text-neutral-500">Password</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-2 w-full border-2 border-neutral-300 bg-neutral-100 px-4 py-3 text-white outline-none focus:border-forge"
          />
        </label>
        {state.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn btn--primary mt-6 w-full disabled:opacity-50">
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}
