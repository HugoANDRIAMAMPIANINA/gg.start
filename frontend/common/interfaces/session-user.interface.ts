import { Tournament } from "./tournament.interface";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  organizedTournaments: Tournament[];
}
