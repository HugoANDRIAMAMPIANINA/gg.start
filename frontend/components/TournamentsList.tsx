import Link from "next/link";


export default async function TournamentsList() {
  const response = await fetch("http://localhost:4321/tournaments");
  const data: Tournmanent[] = await response.json();

  return <ul>
    {data.map((tournament) =>
      <li key={tournament.id}>
        <p>{tournament.name}</p>
        <Link className="bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" href={`/tournaments/${tournament.id}`}>Voir plus</Link>
      </li>
    )}
  </ul>;
}
