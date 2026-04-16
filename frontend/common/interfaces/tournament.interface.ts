import { Bracket } from "./bracket.interface";

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  brackets?: Bracket[];
}
