"use client";

import { register } from "@/lib/actions/auth";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="card shadow-sm w-screen md:w-xl lg:w-md">
      <form action={action} className="card-body gap-12">
        <h1 className="font-medium text-3xl self-center">gg.start</h1>
        <h2 className="card-title self-center">Bienvenue !</h2>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Name"
              className="input input-primary w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {state?.errors?.name && (
            <p className="text-error">{state.errors.name}</p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="input input-primary w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {state?.errors?.email && (
            <p className="text-error">{state.errors.email}</p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input input-primary w-full"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {state?.errors?.password && (
            <div>
              <p>Password must:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error} className="text-error">
                    - {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {state?.error?.message && (
            <p className="text-error">{state.error.message}</p>
          )}
        </div>

        <div className="card-actions justify-end">
          <button
            disabled={pending}
            type="submit"
            className="btn btn-primary w-full"
          >
            S'inscrire
          </button>

          <Link className="link link-primary" href={"/auth/login/"}>
            Se connecter à un compte existant
          </Link>
        </div>
      </form>
    </div>
  );
}
