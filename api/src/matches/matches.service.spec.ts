import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';
import { Bracket } from 'src/brackets/entities/bracket.entity';
import { MatchState } from 'src/common/enums/match-state.enum';
import { BracketState } from 'src/common/enums/bracket-state.enum';

describe('MatchesService', () => {
  let service: MatchesService;
  let matchesRepository: jest.Mocked<any>;
  let matchPlayersRepository: jest.Mocked<any>;
  let bracketsRepository: jest.Mocked<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MatchPlayer),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Bracket),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    matchesRepository = module.get(getRepositoryToken(Match));
    matchPlayersRepository = module.get(getRepositoryToken(MatchPlayer));
    bracketsRepository = module.get(getRepositoryToken(Bracket));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return a match by id', async () => {
      const match = { id: 'match-id', state: MatchState.PENDING };
      matchesRepository.findOne.mockResolvedValue(match);

      const result = await service.findOneById('match-id');

      expect(matchesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'match-id' },
        relations: { players: { bracketPlayer: true } },
      });
      expect(result).toEqual(match);
    });
  });

  describe('findOneByIdWithBracket', () => {
    it('should return a match with bracket by id', async () => {
      const match = { id: 'match-id', bracket: { id: 'bracket-id' } };
      matchesRepository.findOne.mockResolvedValue(match);

      const result = await service.findOneByIdWithBracket('match-id');

      expect(matchesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'match-id' },
        relations: {
          players: { bracketPlayer: true },
          bracket: true,
          winnerNextMatch: true,
          loserNextMatch: true,
        },
      });
      expect(result).toEqual(match);
    });
  });

  describe('updateMatchState', () => {
    it('should update match state', async () => {
      const match = { id: 'match-id', state: MatchState.PENDING };

      matchesRepository.save.mockResolvedValue();

      await service.updateMatchState(match, MatchState.ONGOING);

      expect(matchesRepository.save).toHaveBeenCalledWith({ ...match, state: MatchState.ONGOING });
    });
  });

  describe('markMatchAsOngoing', () => {
    it('should mark match as ongoing', async () => {
      const match = { id: 'match-id', state: MatchState.READY };

      matchesRepository.findOne.mockResolvedValue(match);
      matchesRepository.save.mockResolvedValue();

      await service.markMatchAsOngoing('match-id');

      expect(matchesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'match-id' },
        relations: { players: { bracketPlayer: true } },
      });
      expect(matchesRepository.save).toHaveBeenCalled();
    });
  });

  describe('setMatchScore', () => {
    it('should set match score', async () => {
      const setMatchScoreDto = {
        matchScore: [
          { matchPlayerId: 'mp1', score: 10 },
          { matchPlayerId: 'mp2', score: 5 },
        ],
      };
      const match = {
        id: 'match-id',
        state: MatchState.ONGOING,
        players: [
          { id: 'mp1', score: null, bracketPlayer: { id: 'bp1' } },
          { id: 'mp2', score: null, bracketPlayer: { id: 'bp2' } },
        ],
        bracket: { id: 'bracket-id', state: BracketState.ONGOING },
        winnerNextMatch: { id: 'next-match' },
        winnerNextSlot: 1,
        loserNextMatch: { id: 'loser-match' },
        loserNextSlot: 2,
      };
      const nextMatch = { id: 'next-match', players: [] };
      const loserMatch = { id: 'loser-match', players: [] };

      matchesRepository.findOne.mockImplementation((options) => {
        if (options.where.id === 'match-id') return Promise.resolve(match);
        if (options.where.id === 'next-match') return Promise.resolve(nextMatch);
        if (options.where.id === 'loser-match') return Promise.resolve(loserMatch);
        return Promise.resolve(null);
      });
      matchPlayersRepository.save.mockImplementation((entities) => Promise.resolve(entities as any));
      matchesRepository.save.mockResolvedValue();
      matchPlayersRepository.create.mockImplementation((data) => data as any);

      await service.setMatchScore('match-id', setMatchScoreDto);

      expect(matchesRepository.findOne).toHaveBeenCalledTimes(3);
      expect(matchPlayersRepository.save).toHaveBeenCalledTimes(3); // once for scores, once for winner next match, once for loser
      expect(matchesRepository.save).toHaveBeenCalledTimes(3); // once for match completed, once for winner next match, once for loser
    });
  });
});
