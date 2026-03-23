import { Tournanent } from "@/common/interfaces/tournament.interface";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const response = await fetch(
    `http://localhost:4321/tournaments/${tournamentId}`,
  );
  const data: Tournanent = await response.json();

  return (
    <main>
      {data.name} {data.description}
    </main>
  );
}
