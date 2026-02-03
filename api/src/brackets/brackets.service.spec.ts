import { Test, TestingModule } from '@nestjs/testing';
import { BracketsService } from './brackets.service';

describe('BracketsService', () => {
  let service: BracketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BracketsService],
    }).compile();

    service = module.get<BracketsService>(BracketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
