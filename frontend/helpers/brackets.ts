import { Match } from "@/common/interfaces/bracket-match.interface";

export function groupByRounds(matches: Match[]) {
  const rounds = new Map<number, any[]>();

  for (const match of matches) {
    if (!rounds.has(match.roundNumber)) {
      rounds.set(match.roundNumber, []);
    }
    rounds.get(match.roundNumber).push(match);
  }

  // sort rounds
  return Array.from(rounds.entries())
    .sort(([a], [b]) => a - b)
    .map(([, matches]) =>
      matches.sort((a, b) => a.roundMatchNumber - b.roundMatchNumber),
    );
}

export function getMatchSlots(match: Match) {
  const slots = Array(2).fill(null);

  for (const player of match.players) {
    // slot is 1-based → convert to index
    slots[player.slot - 1] = player;
  }

  return slots;
}
