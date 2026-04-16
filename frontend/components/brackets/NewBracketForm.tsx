"use client";

import { fightingGames } from "@/common/data/games";
import { BracketType } from "@/common/enums/bracket-type.enum";
import { createBracket } from "@/lib/actions/tournaments";
import { useParams } from "next/navigation";
import { useActionState, useState } from "react";

export default function NewBracketForm() {
  const { tournamentId } = useParams();
  const [state, action, pending] = useActionState(createBracket, undefined);
  const [name, setName] = useState<string>("");
  const [game, setGame] = useState<string>("Sélection du jeu");
  const [bracketType, setBracketType] = useState<string>(
    BracketType.SINGLE_ELIM,
  );
  const [startDate, setStartDate] = useState<string>("");

  return (
    <div className="flex flex-col items-center w-screen">
      <form action={action} className="flex flex-col gap-12">
        <h1 className="font-medium text-3xl self-center">
          Ajouter un arbre de tournoi
        </h1>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="label">
              Nom
            </label>
            <input
              id="name"
              name="name"
              placeholder="Name"
              className="input input-primary w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {state?.errors.name && (
            <p className="text-error">{state.errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="game" className="label">
              Jeu
            </label>
            <select
              id="game"
              name="game"
              className="select select-primary w-full"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              required
            >
              <option disabled={true}>Sélection du jeu</option>
              {fightingGames.map((game) => (
                <option key={game} value={game}>
                  {game}
                </option>
              ))}
            </select>
          </div>
          {state?.errors.game && (
            <p className="text-error">{state.errors.game}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="bracketType" className="label">
              Type
            </label>
            <select
              id="bracketType"
              name="bracketType"
              className="select select-primary w-full"
              value={bracketType}
              onChange={(e) => setBracketType(e.target.value)}
              required
            >
              <option value={BracketType.SINGLE_ELIM}>
                Elimination directe (Single Elimination)
              </option>
              <option value={BracketType.DOUBLE_ELIM} disabled>
                Double Elimination
              </option>
            </select>
          </div>
          {state?.errors.bracketType && (
            <p className="text-error">{state.errors.bracketType}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="startDate" className="label">
              Date de début de l'arbre
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={startDate}
              className="input input-primary w-full"
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          {state?.errors.startDate && (
            <p className="text-error">{state.errors.startDate}</p>
          )}
        </div>

        <input
          type="hidden"
          id="tournamentId"
          name="tournamentId"
          value={tournamentId}
        />

        {state?.errors.message && (
          <p className="text-error">{state?.errors.message}</p>
        )}

        <div className="justify-end">
          <button disabled={pending} type="submit" className="btn btn-primary">
            Créer
          </button>
        </div>
      </form>
    </div>
  );
}
