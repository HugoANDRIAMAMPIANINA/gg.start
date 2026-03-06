import { tournaments } from "@/common/data/tournaments";
import { Tournmanent } from "@/common/interfaces/tournament.interface";
import Link from "next/link";

export default async function TournamentsList() {
  const response = await fetch("http://localhost:4321/tournaments");
  const data: Tournmanent[] = await response.json();
  // const data: Tournmanent[] = tournaments;

  return (
    <ul>
      {data.map((tournament) => (
        <li key={tournament.id} className="card shadow-sm w-96">
          <div className="card-body">
            <h2 className="card-title">{tournament.name}</h2>
            <p>{tournament.description}</p>
            <div className="card-actions justify-end">
              <Link
                className="btn btn-primary btn-md"
                href={`/tournaments/${tournament.id}`}
              >
                Voir plus
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
