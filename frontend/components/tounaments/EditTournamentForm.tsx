"use client";

import { createTournament, updateTournament } from "@/lib/actions/tournaments";
import { useActionState, useContext, useEffect, useState } from "react";
import { Input } from "../ui/Input";
import FormField from "../ui/FormField";
import { TextArea } from "../ui/TextArea";
import Button from "../ui/Button";
import { Tournament } from "@/common/interfaces/tournament.interface";
import apiClient from "@/lib/apiClient";
import { notFound, useParams } from "next/navigation";
import { UserContext } from "@/common/contexts/UserContext";
import { isOrganizer } from "@/helpers/user";
import LoadingScreen from "@/screens/LoadingScreen";
import { formatDatetimeLocal } from "@/helpers/date";

export default function EditTournamentForm() {
  const { currentUser, isLoading } = useContext(UserContext);
  const { tournamentId } = useParams();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isOrganizer(currentUser, tournamentId as string)) {
    return notFound();
  }

  const [state, action, pending] = useActionState(updateTournament, undefined);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [tournament, setTournament] = useState<Tournament>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTournament() {
      try {
        const response = await apiClient.get(`/tournaments/${tournamentId}`);
        const tournament: Tournament = response.data;
        if (tournament) {
          setTournament(tournament);
          setName(tournament.name);
          setDescription(tournament.description);
          setStartDate(formatDatetimeLocal(tournament.startDate));
          setEndDate(formatDatetimeLocal(tournament.endDate));
        }
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    }
    fetchTournament();
  }, []);

  return (
    <div className="card shadow-sm mt-4 p-4">
      <form action={action} className="card-body gap-12">
        <h1 className="font-medium text-3xl self-center">
          Mettre à jour les information du tournoi
        </h1>

        <div className="flex flex-col gap-8">
          <FormField label="Nom du tournoi" error={state?.errors.name}>
            <Input
              id="name"
              name="name"
              placeholder="Nom du tournoi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className={`${loading && "skeleton"}`}
            />
          </FormField>

          <FormField label="Description" error={state?.errors.description}>
            <TextArea
              id="description"
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className={`${loading && "skeleton"}`}
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
                disabled={loading}
                className={`${loading && "skeleton"}`}
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
                disabled={loading}
                className={`${loading && "skeleton"}`}
              />
            </FormField>
            <Input
              type="hidden"
              id="tournamentId"
              name="tournamentId"
              value={tournamentId}
            />
          </div>
        </div>

        <div className="justify-end">
          <Button disabled={pending} type="submit" className="btn btn-primary">
            Mettre à jour
          </Button>
        </div>
      </form>
    </div>
  );
}
