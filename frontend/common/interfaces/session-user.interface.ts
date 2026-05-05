import { BracketPlayer } from "./bracket-player.interface";
import { Bracket } from "./bracket.interface";
import { Tournament } from "./tournament.interface";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  organizedTournaments: Tournament[];
  brackets?: BracketPlayer[];
}
