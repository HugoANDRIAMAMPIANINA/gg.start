import { SingleEliminationGenerator } from './single-elimination.generator';
import { Bracket } from '../../entities/bracket.entity';
import { BracketPlayer } from '../../../bracket-players/entities/bracket-player.entity';

describe('SingleEliminationGenerator', () => {
  let generator: SingleEliminationGenerator;

  beforeEach(() => {
    generator = new SingleEliminationGenerator();
  });

  describe('generateMatches', () => {
    it('should generate matches for 2 players', () => {
      const bracket = new Bracket();
      bracket.players = [{}, {}] as BracketPlayer[];

      const matches = generator.generateMatches(bracket);

      expect(matches.length).toBe(1);
      expect(matches[0].roundNumber).toBe(1);
      expect(matches[0].roundMatchNumber).toBe(1);
    });

    it('should generate matches for 4 players', () => {
      const bracket = new Bracket();
      bracket.players = [{}, {}, {}, {}] as BracketPlayer[];

      const matches = generator.generateMatches(bracket);

      expect(matches.length).toBe(3); // 1 final + 2 semi
      expect(matches.some(m => m.roundNumber === 2)).toBe(true);
      expect(matches.some(m => m.roundNumber === 1)).toBe(true);
    });

    it('should generate matches for 8 players', () => {
      const bracket = new Bracket();
      bracket.players = Array(8).fill({}) as BracketPlayer[];

      const matches = generator.generateMatches(bracket);

      expect(matches.length).toBe(7); // 1 final + 2 semi + 4 quarter
    });
  });

  describe('generateFirstRoundMatchPlayers', () => {
    it('should generate match players for first round', () => {
      const matches = [
        { roundNumber: 1, roundMatchNumber: 1 },
        { roundNumber: 1, roundMatchNumber: 2 },
      ] as any;
      const players = [
        { seed: 1 },
        { seed: 2 },
        { seed: 3 },
        { seed: 4 },
      ] as BracketPlayer[];

      const matchPlayers = generator.generateFirstRoundMatchPlayers(matches, players);

      expect(matchPlayers.length).toBe(4);
    });
  });
});