import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Bracket } from '../../entities/bracket.entity';
import { BracketGenerator } from '../bracket-generator.interface';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';

export class DoubleEliminationGenerator implements BracketGenerator {
  generateFirstRoundMatchPlayers(
    matches: Match[],
    players: BracketPlayer[],
  ): MatchPlayer[] {
    throw new Error(
      'Double elimination generateFirstRoundMatchPlayers Method not implemented yet.',
    );
  }
  generateMatches(bracket: Bracket): Match[] {
    throw new Error(
      'Double elimination generateMatches Method not implemented yet',
    );
  }
}
