"use client";

import { fightingGames } from "@/common/data/games";
import { BracketType } from "@/common/enums/bracket-type.enum";
import { createBracket } from "@/lib/actions/tournaments";
import { useParams } from "next/navigation";
import { useActionState, useState } from "react";
import { Input } from "../ui/Input";
import FormField from "../ui/FormField";
import Button from "../ui/Button";

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
    <div className="card shadow-sm mt-4 p-4">
      <form action={action} className="card-body gap-12">
        <h1 className="font-medium text-3xl self-center">
          Ajouter un arbre de tournoi
        </h1>

        <FormField label="Nom de l'arbre de tournoi" error={state?.errors.name}>
          <Input
            id="name"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Jeu" error={state?.errors.game}>
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
        </FormField>

        <FormField
          label="Format de l'arbre de tournoi"
          error={state?.errors.bracketType}
        >
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
        </FormField>

        <FormField
          label="Date de début de l'arbre de tournoi"
          error={state?.errors.name}
        >
          <Input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={startDate}
            className="input input-primary w-full"
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </FormField>

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
          <Button disabled={pending} type="submit">
            Créer
          </Button>
        </div>
      </form>
    </div>
  );
}
