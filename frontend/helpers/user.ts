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
  if (!user) return false;
  return user.brackets.some((bracket) => bracket.id === bracketId);
}
