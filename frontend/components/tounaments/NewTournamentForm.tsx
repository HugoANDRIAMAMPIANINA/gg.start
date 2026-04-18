"use client";

import { createTournament } from "@/lib/actions/tournaments";
import { useActionState, useState } from "react";
import { Input } from "../ui/Input";
import FormField from "../ui/FormField";
import { TextArea } from "../ui/TextArea";
import Button from "../ui/Button";

export default function NewTournamentForm() {
  const [state, action, pending] = useActionState(createTournament, undefined);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  return (
    <div className="card shadow-sm mt-4 p-4">
      <form action={action} className="card-body gap-12">
        <h1 className="font-medium text-3xl self-center">Nouveau tournoi</h1>

        <div className="flex flex-col gap-8">
          <FormField label="Nom du tournoi" error={state?.errors.name}>
            <Input
              id="name"
              name="name"
              placeholder="Nom du tournoi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField label="Description" error={state?.errors.description}>
            <TextArea
              id="description"
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>

          <div className="flex flex-row gap-12">
            <FormField
              label="Date de début du tournoi"
              error={state?.errors.startDate}
            >
              <Input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormField>

            <FormField
              label="Date de fin du tournoi"
              error={state?.errors.startDate}
            >
              <Input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        <div className="justify-end">
          <Button disabled={pending} type="submit" className="btn btn-primary">
            Créer
          </Button>
        </div>
      </form>
    </div>
  );
}
