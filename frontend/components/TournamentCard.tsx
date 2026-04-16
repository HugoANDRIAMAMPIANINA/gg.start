"use client";

import { Tournament } from "@/common/interfaces/tournament.interface";
import Link from "next/link";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const startDate = tournament.startDate
    ? new Date(tournament.startDate).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;
  const endDate = tournament.endDate
    ? new Date(tournament.endDate).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <li className="min-w-[20rem] max-w-sm shrink-0 rounded-3xl border border-base-200 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="card-body flex h-full flex-col gap-4 p-6">
        <div>
          <h3 className="card-title text-lg">{tournament.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-h-16 overflow-hidden">
            {tournament.description ?? "Aucune description disponible."}
          </p>
        </div>

        {(startDate || endDate) && (
          <div className="space-y-1 text-sm text-muted-foreground">
            {startDate && <p>Début : {startDate}</p>}
            {endDate && <p>Fin : {endDate}</p>}
          </div>
        )}

        <div className="mt-auto card-actions justify-end">
          <Link
            className="btn btn-primary btn-sm"
            href={`/tournaments/${tournament.id}`}
          >
            Voir plus
          </Link>
        </div>
      </div>
    </li>
  );
}
