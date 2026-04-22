"use client";

import { register } from "@/lib/actions/auth";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Input } from "../ui/Input";
import FormField from "../ui/FormField";
import Button from "../ui/Button";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="card shadow-sm mt-4 p-4 w-1/4">
      <form action={action} className="card-body gap-12">
        <h1 className="font-medium text-3xl self-center">gg.start</h1>
        <h2 className="card-title self-center">Bienvenue !</h2>

        <div className="flex flex-col gap-2">
          <FormField label="Nom d'utilisateur" error={state?.errors.name}>
            <Input
              id="name"
              name="name"
              placeholder="Nom d'utilisateur"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField label="Email" error={state?.errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Mot de passe" error={state?.errors.password}>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          {state?.errors.message && (
            <p className="text-error text-sm">{state.errors.message}</p>
          )}
        </div>

        <div className="card-actions justify-end">
          <Button width="full" disabled={pending} type="submit">
            S'inscrire
          </Button>

          <Link className="link link-primary" href={"/auth/login/"}>
            Se connecter à un compte existant
          </Link>
        </div>
      </form>
    </div>
  );
}
