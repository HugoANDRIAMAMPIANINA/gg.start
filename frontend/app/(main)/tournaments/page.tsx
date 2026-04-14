"use client";

import { Tournament } from "@/common/interfaces/tournament.interface";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fightingGames } from "@/common/data/games";
import apiClient from "@/lib/apiClient";

export default function TournamentsPage() {
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameFilter, setGameFilter] = useState("");

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Fetch tous les tournois au chargement initial
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await apiClient.get("/tournaments");
        const data: Tournament[] = response.data;
        setTournaments(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tournois:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  // Fonction pour filtrer les tournois
  const performSearch = (searchTerm: string, gameSelected: string | null) => {
    const searchLower = searchTerm.toLowerCase();

    const filtered = tournaments.filter((tournament) => {
      // Si un filtre de jeu est spécifié, il est prioritaire et doit correspondre exactement
      if (gameSelected) {
        const gameMatch =
          tournament.brackets?.some(
            (bracket) =>
              bracket.game.toLowerCase() === gameSelected.toLowerCase(),
          ) || false;

        // Si le jeu ne correspond pas exactement, exclure le tournoi
        if (!gameMatch) return false;

        // Si le jeu correspond, vérifier aussi la recherche de titre ET de jeux (si elle existe)
        const titleMatch =
          !searchLower || tournament.name.toLowerCase().includes(searchLower);
        const gamesMatch =
          !searchLower ||
          tournament.brackets?.some((bracket) =>
            bracket.game.toLowerCase().includes(searchLower),
          ) ||
          false;

        return titleMatch || gamesMatch;
      } else {
        // Si pas de filtre de jeu, chercher dans le titre OU dans les noms des jeux (partial match)
        const titleMatch = tournament.name.toLowerCase().includes(searchLower);
        const gamesMatch =
          tournament.brackets?.some((bracket) =>
            bracket.game.toLowerCase().includes(searchLower),
          ) || false;

        return titleMatch || gamesMatch;
      }
    });

    setFilteredTournaments(filtered);
    setSearching(false);
  };

  // Debounce pour la recherche textuelle uniquement
  useEffect(() => {
    setSearching(true);
    const timer = setTimeout(() => {
      performSearch(search, selectedGame);
    }, 1000); // 1 seconde de debounce

    return () => clearTimeout(timer);
  }, [search, tournaments]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearching(true);
      performSearch(search, selectedGame);
    }
  };

  // Recherche instantanée pour le filtre de jeu
  useEffect(() => {
    performSearch(search, selectedGame);
  }, [selectedGame, tournaments]);

  const filteredGames = fightingGames.filter((game) =>
    game.toLowerCase().includes(gameFilter.toLowerCase()),
  );

  if (loading) {
    return <p className="p-6">Chargement...</p>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Chercher un événement</h1>

      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom de tournoi ou jeu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="input input-bordered w-full"
        />
      </div>

      {/* Filtre de jeux */}
      <div className="mb-6">
        <details className="collapse bg-base-200">
          <summary className="collapse-title font-semibold">
            Filtrer par jeu {selectedGame ? `(${selectedGame})` : "(Aucun)"}
          </summary>
          <div className="collapse-content">
            <input
              type="text"
              placeholder="Rechercher un jeu..."
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="input input-sm input-bordered w-full mb-3"
            />
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredGames.map((game) => (
                <div key={game} className="flex items-center">
                  <input
                    type="checkbox"
                    id={game}
                    checked={selectedGame === game}
                    onChange={() =>
                      setSelectedGame(selectedGame === game ? null : game)
                    }
                    className="checkbox"
                  />
                  <label htmlFor={game} className="label cursor-pointer ml-2">
                    <span className="label-text">{game}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>

      {/* Affichage des critères actifs */}
      <div className="mb-6 text-sm text-gray-600">
        {search && (
          <span>
            Recherche: <strong>{search}</strong>
          </span>
        )}
        {search && selectedGame && <span> | </span>}
        {selectedGame && (
          <span>
            Jeu: <strong>{selectedGame}</strong>
          </span>
        )}
        {searching && (
          <span className="ml-2 loading loading-spinner loading-sm"></span>
        )}
      </div>

      {/* Résultats */}
      {filteredTournaments.length === 0 ? (
        <p className="text-lg text-gray-500">Aucun tournoi trouvé</p>
      ) : (
        <div className="grid gap-4">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="card bg-base-100 shadow-md p-4">
              <h2 className="text-2xl font-semibold">{tournament.name}</h2>
              <p className="text-gray-600">{tournament.description}</p>
              {tournament.brackets && tournament.brackets.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold">Jeux:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tournament.brackets.map((bracket) => (
                      <span key={bracket.id} className="badge badge-primary">
                        {bracket.game}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <Link
                href={`/tournaments/${tournament.id}`}
                className="btn btn-sm btn-primary mt-3"
              >
                Voir détails
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
