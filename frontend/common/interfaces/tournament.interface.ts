import { Bracket } from './bracket.interface';

export interface Tournmanent {
  id: string;
  name: string;
  description: string;
  brackets?: Bracket[];
}
