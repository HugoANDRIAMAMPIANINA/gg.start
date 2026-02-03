import { BracketType } from 'src/common/enums/bracket-type.enum';
import { BracketGeneratorFactory } from './bracket-generator.factory';
import { SingleEliminationGenerator } from './generators/single-elimination.generator';
import { DoubleEliminationGenerator } from './generators/double-elimination.generator';

describe('BracketGeneratorFactory', () => {
  describe('create', () => {
    it('should return SingleEliminationGenerator for SINGLE_ELIM', () => {
      const generator = BracketGeneratorFactory.create(BracketType.SINGLE_ELIM);
      expect(generator).toBeInstanceOf(SingleEliminationGenerator);
    });

    it('should return DoubleEliminationGenerator for DOUBLE_ELIM', () => {
      const generator = BracketGeneratorFactory.create(BracketType.DOUBLE_ELIM);
      expect(generator).toBeInstanceOf(DoubleEliminationGenerator);
    });

    it('should throw error for unsupported type', () => {
      expect(() => BracketGeneratorFactory.create('invalid' as any)).toThrow('BracketType not supported');
    });
  });
});