"use client";

import { createTournament } from "@/lib/actions/tournaments";
import { useActionState, useState } from "react";

export default function NewTournamentForm() {
  const [state, action, pending] = useActionState(createTournament, undefined);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  return (
    <div className="flex flex-col items-center w-screen">
      <form action={action} className="flex flex-col gap-12">
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
              className="textarea input-primary min-h-32 max-h-32 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {state?.errors.description && (
            <p className="text-error">{state.errors.description}</p>
          )}
        </div>

        <div className="flex flex-row gap-12">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="startDate" className="label">
                Date de début du tournoi
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={startDate}
                className="input input-primary w-full"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            {state?.errors.startDate && (
              <p className="text-error">{state.errors.startDate}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="endDate" className="label">
                Date de fin du tournoi
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={endDate}
                className="input input-primary w-full"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {state?.errors.endDate && (
              <p className="text-error">{state.errors.endDate}</p>
            )}
          </div>
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
