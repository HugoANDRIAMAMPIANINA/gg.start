import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Match } from 'src/matches/entities/match.entity';
import { MatchPlayer } from '../entities/match-player.entity';

export default function createMatchPlayer(
  match: Match,
  player: BracketPlayer,
  slot: number,
  isWinner: boolean,
): MatchPlayer {
  const matchPlayer = new MatchPlayer();
  matchPlayer.match = match;
  matchPlayer.bracketPlayer = player;
  matchPlayer.slot = slot;
  matchPlayer.score = 0;
  matchPlayer.isWinner = isWinner;
  return matchPlayer;
}
