import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Bracket } from '../entities/bracket.entity';
import { Match } from 'src/matches/entities/match.entity';

export interface BracketGenerator {
  generate(bracket: Bracket, players: BracketPlayer[]): Match[];
}
