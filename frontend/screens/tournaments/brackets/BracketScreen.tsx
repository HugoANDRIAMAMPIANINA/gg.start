"use client";

import { Match } from "@/common/interfaces/bracket-match.interface";
import { Bracket } from "@/common/interfaces/bracket.interface";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { formatDate } from "@/helpers/date";
import {
  displayBracketState,
  displayBracketType,
  displayMatchState,
} from "@/helpers/enums";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BracketScreen() {
  const { tournamentId, bracketId } = useParams();

  const [bracket, setBracket] = useState<Bracket>();
  const [bracketMatches, setBracketMatches] = useState<Match[]>([]);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBracket() {
      try {
        let response = await apiClient.get(`/brackets/${bracketId}`);
        const bracket: Bracket = response.data;
        if (bracket) {
          setBracket(bracket);
          let response = await apiClient.get(`/brackets/${bracketId}/matches`);
          const bracketMatches: Match[] = response.data;
          setBracketMatches(bracketMatches);
        }
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    }
    fetchBracket();
  }, []);

  if (loading) return <Loader />;

  return (
    <main>
      {bracket && (
        <div>
          <h1>{bracket.name}</h1>
          <p>{displayBracketType(bracket.type)}</p>
          <p>{displayBracketState(bracket.state)}</p>
          <p>{formatDate(bracket.startDate)}</p>
          <Link
            href={`/tournaments/${tournamentId}/brackets/${bracket.id}/players`}
          >
            <Button>Voir les participants</Button>
          </Link>
        </div>
      )}
      {bracketMatches.length > 1 ? (
        <BracketMatchList matches={bracketMatches} />
      ) : (
        <p className="text-xl">
          Pas assez de participants inscrits pour générer des matchs
        </p>
      )}
    </main>
  );
}

interface BracketMatchListProps {
  matches: Match[];
}

function BracketMatchList({ matches }: BracketMatchListProps) {
  return (
    <ul className="list">
      {matches.map((match) => (
        <li key={match.id} className="list-row">
          <div className="flex flex-col gap-4">
            <h3>
              Round {match.roundNumber} - Match {match.roundMatchNumber}
            </h3>
            {match.players.map((player) => (
              <div key={player.id}>
                <p>
                  {player.bracketPlayer.seed} - {player.bracketPlayer.user.name}
                </p>
                <span
                  className={player.isWinner ? "text-success" : "text-base"}
                >
                  {player.score}
                </span>
              </div>
            ))}
          </div>
          <div>{displayMatchState(match.state)}</div>
        </li>
      ))}
    </ul>
  );
}
