import { SessionUser } from "@/common/interfaces/session-user.interface";

export function isOrganizer(
  user: SessionUser | null,
  tournamentId: string,
): boolean {
  if (!user) return false;
  return user.organizedTournaments.some(
    (tournament) => tournament.id === tournamentId,
  );
}

export function isPlayer(user: SessionUser | null, bracketId: string): boolean {
  if (!user || !user.brackets) return false;
  console.log(user.brackets);
  return user.brackets.some(
    (bracketPlayer) => bracketPlayer.bracket.id === bracketId,
  );
}
