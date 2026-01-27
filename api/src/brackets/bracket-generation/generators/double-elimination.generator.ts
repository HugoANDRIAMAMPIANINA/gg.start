import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Bracket } from '../../entities/bracket.entity';
import { BracketGenerator } from '../bracket-generator.interface';

export class DoubleEliminationGenerator implements BracketGenerator {
  generate(bracket: Bracket, players: BracketPlayer[]): Match[] {
    throw new Error('Double elimination not implemented yet');
  }
}
