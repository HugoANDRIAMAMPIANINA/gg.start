import { Bracket } from './bracket.interface';

export interface Tournanent {
  id: string;
  name: string;
  description: string;
  brackets?: Bracket[];
}
