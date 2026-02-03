import { MatchPlayer } from './match-player.entity';

describe('MatchPlayer', () => {
  let matchPlayer: MatchPlayer;

  beforeEach(() => {
    matchPlayer = new MatchPlayer();
  });

  describe('getTotalScore', () => {
    it('should return the score', () => {
      matchPlayer.score = 10;
      expect(matchPlayer.getTotalScore()).toBe(10);
    });
  });

  describe('getWinCount', () => {
    it('should return 1 if isWinner is true', () => {
      matchPlayer.isWinner = true;
      expect(matchPlayer.getWinCount()).toBe(1);
    });

    it('should return 0 if isWinner is false', () => {
      matchPlayer.isWinner = false;
      expect(matchPlayer.getWinCount()).toBe(0);
    });
  });
});