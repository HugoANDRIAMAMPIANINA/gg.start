"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { Bracket } from "@/common/interfaces/bracket.interface";
import { Tournament } from "@/common/interfaces/tournament.interface";
import { formatDate } from "@/helpers/date";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function TournamentScreen() {
  const { currentUser } = useContext(UserContext);
  const { tournamentId } = useParams();

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
        }
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    }
    fetchTournament();
  }, []);

  if (loading) return <main>Chargement en cours...</main>;

  return (
    <main className="px-16 py-8">
      {tournament && (
        <div>
          <h1>{tournament.name}</h1>
          <p>{tournament.description}</p>
          <p>{tournament.organizer.name}</p>
          <p>{formatDate(tournament.startDate)}</p>
          <p>{formatDate(tournament.endDate)}</p>
          {currentUser && tournament.organizer.id === currentUser.id && (
            <Link href={`/tournaments/${tournament.id}/brackets/new`}>
              <button className="btn btn-primary">
                Ajouter un arbre de tournoi
              </button>
            </Link>
          )}
          <BracketList brackets={tournament.brackets} />
        </div>
      )}
    </main>
  );
}

interface BracketListProps {
  brackets: Bracket[];
}

function BracketList({ brackets }: BracketListProps) {
  return (
    <ul className="list p-4 pb-2 bg-base-100 rounded-box shadow-sm">
      <li className="text-sm opacity-60">Arbres de tournoi</li>
      {brackets?.length > 0 ? (
        brackets.map((bracket) => (
          <BracketListRow key={bracket.id} bracket={bracket} />
        ))
      ) : (
        <li className="list-row text-sm opacity-60">
          Aucun arbres de tournoi encore créé
        </li>
      )}
    </ul>
  );
}

interface BracketListRowProps {
  bracket: Bracket;
}

function BracketListRow({ bracket }: BracketListRowProps) {
  const { tournamentId } = useParams();

  return (
    <li className="list-row">
      <div className="list-col-grow flex flex-col gap-1">
        <Link href={`/tournaments/${tournamentId}/brackets/${bracket.id}`}>
          <h2 className="text-xl hover:underline">{bracket.name}</h2>
        </Link>
        <p className="text-md">{bracket.game}</p>
      </div>
      <div>
        <p>{bracket.type}</p>
      </div>
      <div>
        <Link href={`/tournaments/${tournamentId}/brackets/${bracket.id}`}>
          <button className="btn btn-primary px-8">Voir</button>
        </Link>
      </div>
    </li>
  );
}
