import { Tournmanent } from "@/common/interfaces/tournament.interface";


export default async function TournamentPage({ params, }: { params: Promise<{ tournamentId: string }> }) {
	const { tournamentId } = await params;
	const response = await fetch(`http://localhost:4321/tournaments/${tournamentId}`);
	const data: Tournmanent = await response.json();

	return <p>{data.name} {data.description}</p>
}
