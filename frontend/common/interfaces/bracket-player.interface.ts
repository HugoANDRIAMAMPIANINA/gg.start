import { Bracket } from "./bracket.interface";
import { User } from "./user.interface";

export interface BracketPlayer {
  id: string;
  user: User;
  seed: number;
  bracket: Bracket;
}

export interface BracketPlayerSeed {
  bracketPlayerId: string;
  seed: number;
}
