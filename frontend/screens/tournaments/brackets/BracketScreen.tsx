"use client";

import { Bracket } from "@/common/interfaces/bracket.interface";
import { formatDate } from "@/helpers/date";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BracketScreen() {
  const { tournamentId, bracketId } = useParams();

  const [bracket, setBracket] = useState<Bracket>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBracket() {
      try {
        const response = await apiClient.get(`/brackets/${bracketId}`);
        const bracket: Bracket = response.data;
        if (bracket) {
          setBracket(bracket);
        }
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    }
    fetchBracket();
  }, []);

  if (loading) return <main>Chargement en cours...</main>;

  return (
    <main>
      {bracket && (
        <div>
          <h1>{bracket.name}</h1>
          <p>{bracket.type}</p>
          <p>{bracket.state}</p>
          <p>{formatDate(bracket.startDate)}</p>
          <Link
            href={`/tournaments/${tournamentId}/brackets/${bracket.id}/players`}
          >
            <button className="btn btn-primary">Voir les participants</button>
          </Link>
        </div>
      )}
    </main>
  );
}
