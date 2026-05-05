import { User } from "./user.interface";

export interface BracketPlayer {
  id: string;
  user: User;
  seed: number;
}

export interface BracketPlayerSeed {
  bracketPlayerId: string;
  seed: number;
}
