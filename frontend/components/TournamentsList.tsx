"use client";

import { Tournanent } from "@/common/interfaces/tournament.interface";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TournamentsList() {
  const [tournaments, setTournaments] = useState<Tournanent[]>([]);

  useEffect(() => {
    async function fetchTournaments() {
      const response = await apiClient.get("/tournaments");
      const tournaments: Tournanent[] = response.data;
      if (tournaments) {
        setTournaments(tournaments);
      }
    }

    fetchTournaments();
  }, []);

  return (
    <ul>
      {tournaments.map((tournament) => (
        <li key={tournament.id} className="card shadow-sm w-96">
          <div className="card-body">
            <h2 className="card-title">{tournament.name}</h2>
            <p>{tournament.description}</p>
            <div className="card-actions justify-end">
              <Link
                className="btn btn-primary btn-md"
                href={`/tournaments/${tournament.id}`}
              >
                Voir plus
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
