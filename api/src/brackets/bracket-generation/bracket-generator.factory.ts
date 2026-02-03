import { BracketType } from 'src/common/enums/bracket-type.enum';
import { BracketGenerator } from './bracket-generator.interface';
import { SingleEliminationGenerator } from './generators/single-elimination.generator';
import { DoubleEliminationGenerator } from './generators/double-elimination.generator';

export class BracketGeneratorFactory {
  static create(type: BracketType): BracketGenerator {
    switch (type) {
      case BracketType.SINGLE_ELIM:
        return new SingleEliminationGenerator();

      case BracketType.DOUBLE_ELIM:
        return new DoubleEliminationGenerator();

      default:
        throw new Error(`BracketType not supported`);
    }
  }
}
