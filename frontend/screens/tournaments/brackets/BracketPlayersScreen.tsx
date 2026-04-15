"use client";

import { useParams } from "next/navigation";

export default function BracketPlayersScreen() {
  const { bracketId } = useParams();
  return (
    <main>
      <h1 className="text-2xl">{bracketId}</h1>
    </main>
  );
}
