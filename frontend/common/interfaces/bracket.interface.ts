import { Tournament } from "./tournament.interface";

export interface Bracket {
  id: string;
  name: string;
  game: string;
  type: string;
  state: string;
  tournament?: Tournament;
  players: object[];
  startDate: string;
}
