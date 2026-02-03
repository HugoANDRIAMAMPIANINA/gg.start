import { Test, TestingModule } from '@nestjs/testing';
import { BracketsService } from './brackets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bracket } from './entities/bracket.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { BracketPlayer } from 'src/bracket-players/entities/bracket-player.entity';
import { Match } from 'src/matches/entities/match.entity';
import { MatchPlayer } from 'src/match-players/entities/match-player.entity';
import { BracketGeneratorFactory } from './bracket-generation/bracket-generator.factory';
import { MatchState } from 'src/common/enums/match-state.enum';

jest.mock('./bracket-generation/bracket-generator.factory');

describe('BracketsService', () => {
  let service: BracketsService;
  let bracketsRepository: jest.Mocked<any>;
  let tournamentsRepository: jest.Mocked<any>;
  let usersRepository: jest.Mocked<any>;
  let bracketPlayersRepository: jest.Mocked<any>;
  let matchesRepository: jest.Mocked<any>;
  let matchPlayersRepository: jest.Mocked<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BracketsService,
        {
          provide: getRepositoryToken(Bracket),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tournament),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BracketPlayer),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Match),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MatchPlayer),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BracketsService>(BracketsService);
    bracketsRepository = module.get(getRepositoryToken(Bracket));
    tournamentsRepository = module.get(getRepositoryToken(Tournament));
    usersRepository = module.get(getRepositoryToken(User));
    bracketPlayersRepository = module.get(getRepositoryToken(BracketPlayer));
    matchesRepository = module.get(getRepositoryToken(Match));
    matchPlayersRepository = module.get(getRepositoryToken(MatchPlayer));

    // Default mock for findOneBy to return null (for NotFoundException tests)
    bracketsRepository.findOneBy.mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a bracket successfully', async () => {
      const createBracketDto = {
        name: 'Test Bracket',
        game: 'Test Game',
        bracketType: 'SINGLE_ELIM',
        tournamentId: 'tournament-id',
      };
      const tournament = { id: 'tournament-id', name: 'Test Tournament' };
      const bracket = { id: 'bracket-id', name: 'Test Bracket' };

      tournamentsRepository.findOneBy.mockResolvedValue(tournament);
      bracketsRepository.save.mockResolvedValue(bracket);

      const result = await service.create(createBracketDto);

      expect(tournamentsRepository.findOneBy).toHaveBeenCalledWith({ id: createBracketDto.tournamentId });
      expect(bracketsRepository.save).toHaveBeenCalled();
      expect(result).toEqual(bracket);
    });

    it('should throw NotFoundException if tournament not found', async () => {
      const createBracketDto = {
        name: 'Test Bracket',
        game: 'Test Game',
        bracketType: 'SINGLE_ELIM',
        tournamentId: 'tournament-id',
      };

      tournamentsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createBracketDto)).rejects.toThrow('Tournament not found');
    });
  });

  describe('findOneById', () => {
    it('should return a bracket by id', async () => {
      const bracket = { id: 'bracket-id', name: 'Test Bracket' };
      bracketsRepository.findOne.mockResolvedValue(bracket);

      const result = await service.findOneById('bracket-id');

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: { players: { user: true } },
        order: { players: { seed: 'ASC' } },
      });
      expect(result).toEqual(bracket);
    });

    it('should throw NotFoundException if bracket not found', async () => {
      await expect(service.findOneById('bracket-id')).rejects.toThrow('Bracket not found');
    });
  });

  describe('update', () => {
    it('should update a bracket', async () => {
      const updateBracketDto = { name: 'Updated Bracket' };
      const bracket = { id: 'bracket-id', name: 'Test Bracket' };

      bracketsRepository.findOne.mockResolvedValue(bracket);
      bracketsRepository.save.mockResolvedValue({ ...bracket, ...updateBracketDto });

      await service.update('bracket-id', updateBracketDto);

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: { players: { user: true } },
        order: { players: { seed: 'ASC' } },
      });
      expect(bracketsRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a bracket', async () => {
      bracketsRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove('bracket-id');

      expect(bracketsRepository.delete).toHaveBeenCalledWith('bracket-id');
    });
  });

  describe('addPlayer', () => {
    it('should add a player to bracket', async () => {
      const addPlayerDto = { userId: 'user-id', seeding: 1 };
      const bracket = { id: 'bracket-id', name: 'Test Bracket', players: [] };
      const user = { id: 'user-id', name: 'Test User' };
      const bracketPlayer = { id: 'bp-id', bracket, user, seeding: 1 };

      bracketsRepository.findOne.mockResolvedValue(bracket);
      usersRepository.findOneBy.mockResolvedValue(user);
      bracketPlayersRepository.save.mockResolvedValue(bracketPlayer);

      const result = await service.addPlayer('bracket-id', addPlayerDto);

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: { players: { user: true } },
        order: { players: { seed: 'ASC' } },
      });
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
      expect(bracketPlayersRepository.save).toHaveBeenCalled();
      expect(result).toEqual(bracketPlayer);
    });
  });

  describe('removePlayer', () => {
    it('should remove a player from bracket', async () => {
      const bracketPlayer = { id: 'user-id', seeding: 1 };

      bracketsRepository.findOne.mockResolvedValue({ id: 'bracket-id' });
      bracketPlayersRepository.findOneBy.mockResolvedValue(bracketPlayer);
      bracketPlayersRepository.delete.mockResolvedValue({ affected: 1 } as any);
      bracketPlayersRepository.find.mockResolvedValue([]);

      await service.removePlayer('bracket-id', 'user-id');

      expect(bracketPlayersRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
      expect(bracketPlayersRepository.delete).toHaveBeenCalledWith({ id: 'user-id' });
    });
  });

  describe('findPlayers', () => {
    it('should return players for a bracket', async () => {
      const bracket = { id: 'bracket-id', players: [{ id: 'bp-id', user: { name: 'Player' } }] };
      const players = [{ id: 'bp-id', user: { name: 'Player' } }];

      bracketsRepository.findOne.mockResolvedValue(bracket);

      const result = await service.findPlayers('bracket-id');

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: { players: { user: true } },
        order: { players: { seed: 'ASC' } },
      });
      expect(result).toEqual(players);
    });
  });

  describe('findBracketMatches', () => {
    it('should return matches for a bracket', async () => {
      const bracket = { id: 'bracket-id', matches: [{ id: 'match-id' }] };

      bracketsRepository.findOne.mockResolvedValue(bracket);

      const result = await service.findBracketMatches('bracket-id');

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: {
          matches: {
            players: {
              bracketPlayer: {
                user: true,
              },
            },
          },
        },
        order: {
          matches: {
            roundMatchNumber: {
              direction: 'ASC',
            },
            roundNumber: {
              direction: 'ASC',
            },
          },
        },
      });
      expect(result).toEqual(bracket.matches);
    });
  });

    it('should generate bracket matches', async () => {
      const bracket = { id: 'bracket-id', type: 'SINGLE_ELIM', players: [{ id: 'bp1' }, { id: 'bp2' }], matches: [] };
      const matches = [{ id: 'match1' }];
      const matchPlayers = [{ id: 'mp1', match: { id: 'match1', state: 'PENDING' }, isWinner: true, bracketPlayer: { id: 'bp1' } }];

      const mockGenerator = {
        generateMatches: jest.fn().mockReturnValue(matches),
        generateFirstRoundMatchPlayers: jest.fn().mockReturnValue(matchPlayers),
      };

      (BracketGeneratorFactory.create as jest.Mock).mockReturnValue(mockGenerator);

      bracketsRepository.findOne.mockResolvedValue(bracket);
      bracketPlayersRepository.find.mockResolvedValue(bracket.players);
      matchesRepository.save.mockImplementation((entities) => Promise.resolve(entities));
      matchPlayersRepository.save.mockResolvedValue(matchPlayers);
      matchesRepository.save.mockResolvedValue({});

      await service.generateBracket('bracket-id');

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: { matches: true, players: true },
        order: { players: { seed: 'ASC' } },
      });
      expect(BracketGeneratorFactory.create).toHaveBeenCalledWith('SINGLE_ELIM');
      expect(mockGenerator.generateMatches).toHaveBeenCalledWith(bracket);
      expect(matchesRepository.save).toHaveBeenCalledWith(matches);
      expect(matchPlayersRepository.save).toHaveBeenCalledWith(matchPlayers);
    });

    it('should update bracket seeding', async () => {
      const bracket = { id: 'bracket-id' };
      const updateDto = { players: [{ bracketPlayerId: 'bp1', seed: 1 }, { bracketPlayerId: 'bp2', seed: 2 }, { bracketPlayerId: 'bp3', seed: 3 }] };
      const bracketPlayer1 = { id: 'bp1', seed: 0 };
      const bracketPlayer2 = { id: 'bp2', seed: 0 };

      bracketsRepository.findOne.mockResolvedValue(bracket);
      bracketPlayersRepository.findOneBy.mockImplementation((query) => {
        if (query.id === 'bp1') return Promise.resolve(bracketPlayer1);
        if (query.id === 'bp2') return Promise.resolve(bracketPlayer2);
        return Promise.resolve(null);
      });
      bracketPlayersRepository.save.mockResolvedValue({} as any);

      await service.updateBracketSeeding('bracket-id', updateDto);

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: { players: { user: true } },
        order: { players: { seed: 'ASC' } },
      });
      expect(bracketPlayersRepository.findOneBy).toHaveBeenCalledWith({ id: 'bp1' });
      expect(bracketPlayersRepository.findOneBy).toHaveBeenCalledWith({ id: 'bp2' });
      expect(bracketPlayersRepository.findOneBy).toHaveBeenCalledWith({ id: 'bp3' });
      expect(bracketPlayersRepository.save).toHaveBeenCalledWith({ ...bracketPlayer1, seed: 1 });
      expect(bracketPlayersRepository.save).toHaveBeenCalledWith({ ...bracketPlayer2, seed: 2 });
      expect(bracketPlayersRepository.save).toHaveBeenCalledTimes(2); // bp3 not found, not saved
    });

    it('should throw NotFoundException if bracket not found for updateBracketSeeding', async () => {
      bracketsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateBracketSeeding('invalid-id', { players: [] })).rejects.toThrow('Bracket not found');
    });

    it('should not generate bracket if less than 2 players', async () => {
      const bracket = { id: 'bracket-id', type: 'SINGLE_ELIM', players: [{ id: 'bp1' }], matches: [] };

      bracketsRepository.findOne.mockResolvedValue(bracket);

      await service.generateBracket('bracket-id');

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: { matches: true, players: true },
        order: { players: { seed: 'ASC' } },
      });
      expect(matchesRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if bracket not found for generateBracket', async () => {
      bracketsRepository.findOne.mockResolvedValue(null);

      await expect(service.generateBracket('invalid-id')).rejects.toThrow('Bracket not found');
    });

    it('should get player stats', async () => {
      const bracket = { id: 'bracket-id' };
      const bracketPlayer = {
        id: 'bp1',
        matchPlayers: [{}, {}, {}],
        getTotalScore: jest.fn().mockReturnValue(10),
        getWinCount: jest.fn().mockReturnValue(2),
      };

      bracketsRepository.findOne.mockResolvedValue(bracket);
      bracketPlayersRepository.findOne.mockResolvedValue(bracketPlayer);

      const result = await service.getPlayerStats('bracket-id', 'bp1');

      expect(bracketsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bracket-id' },
        relations: { players: { user: true } },
        order: { players: { seed: 'ASC' } },
      });
      expect(bracketPlayersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bp1' },
        select: { matchPlayers: true },
        relations: { matchPlayers: true },
      });
      expect(result).toEqual({
        totalScore: 10,
        totalWins: 2,
        totalPlayedMatches: 3,
      });
    });

    it('should throw NotFoundException if bracketPlayer not found for getPlayerStats', async () => {
      const bracket = { id: 'bracket-id' };

      bracketsRepository.findOne.mockResolvedValue(bracket);
      bracketPlayersRepository.findOne.mockResolvedValue(null);

      await expect(service.getPlayerStats('bracket-id', 'bp1')).rejects.toThrow('BracketPlayer not found');
    });

    it('should handle winner logic in generateBracket', async () => {
      const bracket = {
        id: 'bracket-id',
        type: 'SINGLE_ELIM',
        players: [{ id: 'bp1' }, { id: 'bp2' }],
        matches: [{ id: 'm1' }],
      };
      const matches = [{ id: 'm1', winnerNextMatch: { id: 'm2' }, winnerNextSlot: 1 }];
      const matchPlayers = [
        {
          id: 'mp1',
          isWinner: true,
          match: matches[0],
          bracketPlayer: { id: 'bp1' },
        },
        {
          id: 'mp2',
          isWinner: false,
          match: { id: 'm1', state: MatchState.READY },
        },
      ];

      const mockGenerator = {
        generateMatches: jest.fn().mockReturnValue(matches),
        generateFirstRoundMatchPlayers: jest.fn().mockReturnValue(matchPlayers),
      };

      (BracketGeneratorFactory.create as jest.Mock).mockReturnValue(mockGenerator);

      bracketsRepository.findOne.mockResolvedValue(bracket);
      matchesRepository.delete.mockResolvedValue({});
      matchesRepository.save.mockResolvedValue({});
      matchPlayersRepository.save.mockResolvedValueOnce(matchPlayers).mockResolvedValue({});

      await service.generateBracket('bracket-id');

      expect(matchesRepository.save).toHaveBeenCalledWith(matches);
      expect(matchPlayersRepository.save).toHaveBeenCalledWith(matchPlayers);
      // Check that winner next match player is created
      expect(matchPlayersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          match: { id: 'm2' },
          bracketPlayer: { id: 'bp1' },
          slot: 1,
          isWinner: false,
        })
      );
      // Check match states are updated
      expect(matchesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ state: MatchState.COMPLETED })
      );
      expect(matchesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ state: MatchState.READY })
      );
    });
  });
