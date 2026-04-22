import { User } from "./user.interface";

export interface BracketPlayer {
  id: string;
  user: User;
  seed: number;
}
