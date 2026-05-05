"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { MatchState } from "@/common/enums/match-state.enum";
import { Match } from "@/common/interfaces/bracket-match.interface";
import { Bracket } from "@/common/interfaces/bracket.interface";
import { MatchScore } from "@/common/interfaces/match-score.interface";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { Modal } from "@/components/ui/Modal";
import { getMatchSlots, groupByRounds } from "@/helpers/brackets";
import { formatDate } from "@/helpers/date";
import {
  displayBracketState,
  displayBracketType,
  displayMatchState,
} from "@/helpers/enums";
import { isOrganizer } from "@/helpers/user";
import { setMatchOngoing, updateMatchScore } from "@/lib/actions/brackets";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function BracketScreen() {
  const { tournamentId, bracketId } = useParams();

  const [bracket, setBracket] = useState<Bracket>();
  const [bracketMatches, setBracketMatches] = useState<Match[]>([]);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refetch, setRefetch] = useState<boolean>(true);

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
    if (refetch) {
      fetchBracket();
      setRefetch(false);
    }
  }, [refetch]);

  const triggerRefetch = () => {
    setRefetch(true);
  };

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

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
        <BracketView matches={bracketMatches} triggerRefetch={triggerRefetch} />
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
  triggerRefetch: () => void;
}

function BracketView({ matches, triggerRefetch }: BracketMatchListProps) {
  const { currentUser } = useContext(UserContext);
  const { tournamentId } = useParams();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  useEffect(() => {
    if (selectedMatch) {
      setScores([
        selectedMatch.players[0]?.score || 0,
        selectedMatch.players[1]?.score || 0,
      ]);
    }
  }, [selectedMatch]);

  const setMatchScore = async () => {
    if (!selectedMatch) return;

    const slots = getMatchSlots(selectedMatch);

    const matchScore: MatchScore[] = slots
      .map((player, index) => {
        if (!player) return null;

        return {
          matchPlayerId: player.id,
          score: scores[index],
        };
      })
      .filter(Boolean) as MatchScore[];

    const errorMessage = await updateMatchScore(selectedMatch.id, matchScore);
    if (errorMessage) {
      setModalErrorMessage(errorMessage);
      return;
    }

    triggerRefetch();
    closeModal();
  };

  const startMatch = async () => {
    if (!selectedMatch) return;
    const errorMessage = await setMatchOngoing(selectedMatch.id);
    if (errorMessage) {
      setModalErrorMessage(errorMessage);
      return;
    }

    triggerRefetch();
    closeModal();
  };

  const closeModal = () => {
    setSelectedMatch(null);
    setModalErrorMessage("");
  };

  const rounds = groupByRounds(matches);
  return (
    <>
      <div className="flex gap-12 p-8 overflow-x-auto">
        {rounds.map((round, roundNumber) => (
          <div key={roundNumber} className="flex flex-col justify-around gap-8">
            {round.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => setSelectedMatch(match)}
              />
            ))}
          </div>
        ))}
      </div>
      {selectedMatch && (
        <Modal
          title={`Round ${selectedMatch.roundNumber} Match ${selectedMatch.roundMatchNumber}`}
          open={selectedMatch && true}
        >
          <h4>{displayMatchState(selectedMatch.state)}</h4>
          {getMatchSlots(selectedMatch).map((player, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-32">
                {player
                  ? player.bracketPlayer.user.name
                  : selectedMatch.state === MatchState.COMPLETED
                    ? " "
                    : "A déterminer"}
              </span>
              {selectedMatch.state !== MatchState.ONGOING ? (
                <span>{player ? player.score : ""}</span>
              ) : isOrganizer(currentUser, tournamentId as string) ? (
                <Input
                  type="number"
                  min={0}
                  value={scores[index]}
                  onChange={(e) => {
                    const newScores = [...scores] as [number, number];
                    newScores[index] = Number(e.target.value);
                    setScores(newScores);
                  }}
                />
              ) : (
                <span>{player ? player.score : ""}</span>
              )}
            </div>
          ))}
          {modalErrorMessage && (
            <div className="modal-bottom">
              <p className="text-error">{modalErrorMessage}</p>
            </div>
          )}

          <div className="modal-action">
            {isOrganizer(currentUser, tournamentId as string) && (
              <>
                {selectedMatch.state === MatchState.READY && (
                  <Button onClick={() => startMatch()}>Lancer le match</Button>
                )}
                {selectedMatch.state === MatchState.ONGOING && (
                  <Button onClick={() => setMatchScore()}>Valider</Button>
                )}
              </>
            )}

            <Button color="none" onClick={closeModal}>
              Fermer
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

interface MatchCardProps {
  match: Match;
  onClick: () => void;
}

function MatchCard({ match, onClick }: MatchCardProps) {
  const slots = getMatchSlots(match);

  return (
    <div
      className={`bg-base-200 w-48 lg:w-64 shadow-sm hover:cursor-pointer hover:brightness-95 border-y-4 border-base-200 ${match.state === MatchState.ONGOING && "border-success animate-pulse"}`}
      onClick={onClick}
    >
      {slots.map((player, index) => {
        if (!player) {
          return (
            <div
              key={index}
              className="flex justify-between pl-4 opacity-40 italic"
            >
              <div className="grow flex flex-row justify-between pr-2 py-1">
                <span>
                  {match.state === MatchState.COMPLETED ? "-" : "A déterminer"}
                </span>
                <span>-</span>
              </div>
              <div
                className={`w-2 ${match.state === MatchState.COMPLETED ? "bg-gray-400" : ""}`}
              ></div>
            </div>
          );
        }

        return (
          <div key={player.id} className={`flex justify-between pl-4`}>
            <div className="grow flex flex-row justify-between pr-2 py-1">
              <span>{player.bracketPlayer.user.name}</span>
              <span>{player.score}</span>
            </div>
            <div
              className={`w-2 ${player.isWinner ? "bg-success" : match.state === MatchState.COMPLETED ? "bg-base-300" : ""}`}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
