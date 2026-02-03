import { Test, TestingModule } from '@nestjs/testing';
import { BracketsController } from './brackets.controller';
import { BracketsService } from './brackets.service';

describe('BracketsController', () => {
  let controller: BracketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BracketsController],
      providers: [BracketsService],
    }).compile();

    controller = module.get<BracketsController>(BracketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
