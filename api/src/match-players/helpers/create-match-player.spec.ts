import createMatchPlayer from './create-match-player';
import { MatchPlayer } from '../entities/match-player.entity';

describe('createMatchPlayer', () => {
  it('should create a MatchPlayer with correct properties', () => {
    const match = { id: '1' } as any;
    const player = { id: '2' } as any;
    const slot = 1;
    const isWinner = false;

    const result = createMatchPlayer(match, player, slot, isWinner);

    expect(result).toBeInstanceOf(MatchPlayer);
    expect(result.match).toBe(match);
    expect(result.bracketPlayer).toBe(player);
    expect(result.slot).toBe(slot);
    expect(result.score).toBe(0);
    expect(result.isWinner).toBe(isWinner);
  });
});