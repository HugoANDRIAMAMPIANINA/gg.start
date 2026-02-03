import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

describe('MatchesController', () => {
  let controller: MatchesController;
  let matchesService: jest.Mocked<MatchesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: {
            findOneById: jest.fn(),
            markMatchAsOngoing: jest.fn(),
            setMatchScore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    matchesService = module.get(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return a match', async () => {
      const result = { id: 'match-id' };

      matchesService.findOneById.mockResolvedValue(result as any);

      expect(await controller.findOneById('match-id')).toEqual(result);
      expect(matchesService.findOneById).toHaveBeenCalledWith('match-id');
    });
  });

  describe('markMatchAsOngoing', () => {
    it('should mark match as ongoing', async () => {
      matchesService.markMatchAsOngoing.mockResolvedValue();

      await controller.markMatchAsOngoing('match-id');

      expect(matchesService.markMatchAsOngoing).toHaveBeenCalledWith('match-id');
    });
  });

  describe('setMatchScore', () => {
    it('should set match score', async () => {
      const setMatchScoreDto = { player1Score: 10, player2Score: 5 };

      matchesService.setMatchScore.mockResolvedValue();

      await controller.setMatchScore('match-id', setMatchScoreDto);

      expect(matchesService.setMatchScore).toHaveBeenCalledWith('match-id', setMatchScoreDto);
    });
  });
});
