import { Match } from "./bracket-match.interface";
import { BracketPlayer } from "./bracket-player.interface";

export interface MatchPlayer {
  id: string;
  match: Match;
  bracketPlayer: BracketPlayer;
  slot: number;
  score: number;
  isWinner: boolean;
}
