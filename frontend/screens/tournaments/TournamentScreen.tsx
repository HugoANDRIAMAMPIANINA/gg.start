"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { Bracket } from "@/common/interfaces/bracket.interface";
import { Tournament } from "@/common/interfaces/tournament.interface";
import Loader from "@/components/ui/Loader";
import { formatDate } from "@/helpers/date";
import { displayBracketType } from "@/helpers/enums";
import apiClient from "@/lib/apiClient";
import { CalendarDays, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import { deleteTournament } from "@/lib/actions/tournaments";

export default function TournamentScreen() {
  const { currentUser } = useContext(UserContext);
  const { tournamentId } = useParams();
  const router = useRouter();

  const [tournament, setTournament] = useState<Tournament>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [deletePending, setDeletePending] = useState<boolean>(false);

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

  const onClickDeleteTournament = async () => {
    setDeletePending(true);
    await deleteTournament(tournamentId as string);
    setDeletePending(false);
    router.replace("/");
  };

  if (loading) return <LoadingScreen />;

  if (tournament) {
    return (
      <main className="px-16 py-8 flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div>
              {" "}
              <span className="text-md font-semibold opacity-50 uppercase">
                Tournoi
              </span>
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
            </div>

            <p>{tournament.description}</p>
          </div>
          <div className="flex flex-row gap-1">
            <CalendarDays />
            <p>
              Du{" "}
              <strong className="font-semibold">
                {formatDate(tournament.startDate)}
              </strong>{" "}
              au{" "}
              <strong className="font-semibold">
                {formatDate(tournament.endDate)}
              </strong>
            </p>
          </div>
          {currentUser && tournament.organizer.id === currentUser.id && (
            <div className="flex flex-row gap-2">
              <Link href={`/tournaments/${tournament.id}/brackets/new`}>
                <Button>Ajouter un arbre de tournoi</Button>
              </Link>

              <Link href={`/tournaments/${tournamentId}/edit`}>
                <Button>Modifier les informations du tournoi</Button>
              </Link>

              <Button
                color="error"
                onClick={onClickDeleteTournament}
                disabled={deletePending}
              >
                Supprimer
                <Trash width={20} />
              </Button>
            </div>
          )}
        </div>

        <Divider />

        <BracketList brackets={tournament.brackets} />
      </main>
    );
  }
}

interface BracketListProps {
  brackets: Bracket[];
}

function BracketList({ brackets }: BracketListProps) {
  return (
    <ul className="list p-4 pb-2 bg-base-100 rounded-box shadow-sm w-full md:w-1/2">
      <li className="text-sm opacity-60">Arbres de tournoi</li>
      {brackets.length > 0 ? (
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
    <li className="list-row items-center">
      <div className="list-col-grow flex flex-col gap-1">
        <Link href={`/tournaments/${tournamentId}/brackets/${bracket.id}`}>
          <h2 className="text-xl hover:underline">{bracket.name}</h2>
        </Link>
        <p className="text-md">{bracket.game}</p>
      </div>
      <div>
        <p>{displayBracketType(bracket.type)}</p>
      </div>
      <div>
        <Link href={`/tournaments/${tournamentId}/brackets/${bracket.id}`}>
          <button className="btn btn-primary px-8">Voir</button>
        </Link>
      </div>
    </li>
  );
}
