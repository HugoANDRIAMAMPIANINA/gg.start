import { BracketPlayer } from './bracket-player.entity';
import { MatchPlayer } from '../../match-players/entities/match-player.entity';

describe('BracketPlayer', () => {
  let bracketPlayer: BracketPlayer;

  beforeEach(() => {
    bracketPlayer = new BracketPlayer();
  });

  describe('getTotalScore', () => {
    it('should return 0 when no matchPlayers', () => {
      bracketPlayer.matchPlayers = [];
      expect(bracketPlayer.getTotalScore()).toBe(0);
    });

    it('should return 0 when matchPlayers is undefined', () => {
      bracketPlayer.matchPlayers = undefined;
      expect(bracketPlayer.getTotalScore()).toBe(0);
    });

    it('should return sum of matchPlayers scores', () => {
      const matchPlayer1 = { getTotalScore: () => 10 } as MatchPlayer;
      const matchPlayer2 = { getTotalScore: () => 5 } as MatchPlayer;
      bracketPlayer.matchPlayers = [matchPlayer1, matchPlayer2];
      expect(bracketPlayer.getTotalScore()).toBe(15);
    });
  });

  describe('getWinCount', () => {
    it('should return 0 when no matchPlayers', () => {
      bracketPlayer.matchPlayers = [];
      expect(bracketPlayer.getWinCount()).toBe(0);
    });

    it('should return 0 when matchPlayers is undefined', () => {
      bracketPlayer.matchPlayers = undefined;
      expect(bracketPlayer.getWinCount()).toBe(0);
    });

    it('should return sum of matchPlayers win counts', () => {
      const matchPlayer1 = { getWinCount: () => 2 } as MatchPlayer;
      const matchPlayer2 = { getWinCount: () => 1 } as MatchPlayer;
      bracketPlayer.matchPlayers = [matchPlayer1, matchPlayer2];
      expect(bracketPlayer.getWinCount()).toBe(3);
    });
  });
});