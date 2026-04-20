"use client";

import { useRef, type PointerEvent } from "react";
import { useRouter } from "next/navigation";
import { Tournament } from "@/common/interfaces/tournament.interface";
import Link from "next/link";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const router = useRouter();
  const hasDraggedRef = useRef(false);
  const startXRef = useRef<number | null>(null);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const startDate = tournament.startDate ? formatDate(tournament.startDate) : null;
  const endDate = tournament.endDate ? formatDate(tournament.endDate) : null;

  const dateLine = startDate
    ? endDate && startDate !== endDate
      ? `${startDate} - ${endDate}`
      : startDate
    : null;

  const handleCardPointerDown = (event: PointerEvent<HTMLLIElement>) => {
    startXRef.current = event.clientX;
    hasDraggedRef.current = false;
  };

  const handleCardPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    if (startXRef.current === null) return;
    if (hasDraggedRef.current) return;

    const distance = Math.abs(event.clientX - startXRef.current);
    if (distance > 10) {
      hasDraggedRef.current = true;
    }
  };

  const handleCardPointerUp = () => {
    startXRef.current = null;
  };

  const handleCardClick = () => {
    if (!hasDraggedRef.current) {
      router.push(`/tournaments/${tournament.id}`);
    }
  };

  return (
    <li
      className="min-w-[20rem] max-w-sm shrink-0 rounded-3xl border border-base-200 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
      onClick={handleCardClick}
      onPointerDown={handleCardPointerDown}
      onPointerMove={handleCardPointerMove}
      onPointerUp={handleCardPointerUp}
      onPointerLeave={handleCardPointerUp}
    >
      <div className="card-body flex h-full flex-col gap-4 p-6">
        <div>
          <h3 className="card-title text-lg">{tournament.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-h-16 overflow-hidden">
            {tournament.description ?? "Aucune description disponible."}
          </p>
          {tournament.organizer && (
            <p className="mt-4 text-sm text-primary">
              Organisé par{' '}
              <Link
                className="font-medium underline"
                href={`/profile/${tournament.organizer.id}`}
                onClick={(event) => event.stopPropagation()}
              >
                {tournament.organizer.name}
              </Link>
            </p>
          )}
        </div>

        {(dateLine || tournament.participantCount !== undefined || tournament.resultText) && (
          <div className="space-y-1 text-sm text-muted-foreground">
            {dateLine && (
              <p className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                {dateLine}
              </p>
            )}
            {tournament.participantCount !== undefined && (
              <p className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                Participants : {tournament.participantCount}
              </p>
            )}
            {tournament.resultText && (
              <p className="font-medium">{tournament.resultText}</p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
