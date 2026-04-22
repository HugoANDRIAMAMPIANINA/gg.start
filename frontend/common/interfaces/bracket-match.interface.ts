import { MatchState } from "../enums/match-state.enum";
import { MatchPlayer } from "./match-player.interface";

export interface Match {
  id: string;
  roundNumber: number;
  roundMatchNumber: number;
  state: MatchState;
  players: MatchPlayer[];
  winnerNextMatch: Match | null;
  winnerNextSlot: number | null;
  loserNextMatch: Match | null;
  loserNextSlot: number | null;
}
