"use client";

import { createTournament } from "@/lib/actions/tournaments";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function NewTournamentForm() {
  const [state, action, pending] = useActionState(createTournament, undefined);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="flex flex-col w-screen md:w-xl lg:w-md">
      <form action={action} className="gap-12">
        <h1 className="font-medium text-3xl self-center">Nouveau tournoi</h1>

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
          {state?.errors.name && (
            <p className="text-error">{state.errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              className="textarea input-primary w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {state?.errors.description && (
            <p className="text-error">{state.errors.description}</p>
          )}
        </div>

        <div className="justify-end">
          <button disabled={pending} type="submit" className="btn btn-primary">
            Créer
          </button>
        </div>
      </form>
    </div>
  );
}
