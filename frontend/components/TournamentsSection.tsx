"use client";

import { Tournament } from "@/common/interfaces/tournament.interface";
import TournamentCard from "@/components/TournamentCard";

interface TournamentsSectionProps {
  title: string;
  tournaments: Tournament[];
  emptyMessage: string;
}

export default function TournamentsSection({
  title,
  tournaments,
  emptyMessage,
}: TournamentsSectionProps) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground"></p>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        {tournaments.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {tournaments.length} résultat(s)
          </p>
        )}
      </div>

      {tournaments.length > 0 ? (
        <div className="overflow-x-auto pb-4">
          <ul className="flex gap-4">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-3xl border border-base-200 bg-base-100 p-6 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
