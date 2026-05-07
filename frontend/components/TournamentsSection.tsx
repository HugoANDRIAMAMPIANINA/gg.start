"use client";

import { useRef, useState, type PointerEvent } from "react";
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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    setStartX(event.clientX);
    setScrollLeft(container.scrollLeft);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || !isPointerDownRef.current) return;

    const x = event.clientX;
    const walk = x - startX;
    const dragThreshold = 10;

    if (!hasDraggedRef.current && Math.abs(walk) > dragThreshold) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (hasDraggedRef.current) {
      container.scrollLeft = scrollLeft - walk;
    }
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (container && hasDraggedRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    isPointerDownRef.current = false;
    hasDraggedRef.current = false;
    setIsDragging(false);
  };

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
        <div
          ref={scrollRef}
          className={`overflow-x-auto pb-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
          style={{ touchAction: "pan-y" }}
        >
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
