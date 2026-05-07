import { BracketState } from "../enums/bracket-state.enum";
import { BracketType } from "../enums/bracket-type.enum";
import { Match } from "./bracket-match.interface";
import { BracketPlayer } from "./bracket-player.interface";
import { Tournament } from "./tournament.interface";

export interface Bracket {
  id: string;
  name: string;
  game: string;
  type: BracketType;
  state: BracketState;
  tournament?: Tournament;
  players: BracketPlayer[];
  matches: Match[];
  startDate: string;
}
