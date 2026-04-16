import { Bracket } from "./bracket.interface";
import { User } from "./user.interface";

export interface Tournament {
  id: string;
  name: string;
  description: string;
  brackets: Bracket[];
  startDate: string;
  endDate: string;
  organizer: User;
}
