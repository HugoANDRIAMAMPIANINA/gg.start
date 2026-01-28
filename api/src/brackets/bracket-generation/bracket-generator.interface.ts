import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Bracket } from '../entities/bracket.entity';
import { Match } from 'src/matches/entities/match.entity';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';

export interface BracketGenerator {
  generateMatches(bracket: Bracket): Match[];
  generateFirstRoundMatchPlayers(
    matches: Match[],
    players: BracketPlayer[],
  ): MatchPlayer[];
}
