import { Test, TestingModule } from '@nestjs/testing';
import { BracketsController } from './brackets.controller';
import { BracketsService } from './brackets.service';

describe('BracketsController', () => {
  let controller: BracketsController;
  let bracketsService: jest.Mocked<BracketsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BracketsController],
      providers: [
        {
          provide: BracketsService,
          useValue: {
            create: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            addPlayer: jest.fn(),
            removePlayer: jest.fn(),
            findPlayers: jest.fn(),
            findBracketMatches: jest.fn(),
            generateBracket: jest.fn(),
            getPlayerStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BracketsController>(BracketsController);
    bracketsService = module.get(BracketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a bracket', async () => {
      const createBracketDto = { name: 'Test', tournamentId: 'tournament-id', type: 'SINGLE_ELIMINATION' as any };
      const result = { id: 'bracket-id' };

      bracketsService.create.mockResolvedValue(result as any);

      expect(await controller.create(createBracketDto)).toEqual(result);
      expect(bracketsService.create).toHaveBeenCalledWith(createBracketDto);
    });
  });

  describe('findOne', () => {
    it('should return a bracket', async () => {
      const result = { id: 'bracket-id' };

      bracketsService.findOneById.mockResolvedValue(result as any);

      expect(await controller.findOne('bracket-id')).toEqual(result);
      expect(bracketsService.findOneById).toHaveBeenCalledWith('bracket-id');
    });
  });

  describe('update', () => {
    it('should update a bracket', async () => {
      const updateBracketDto = { name: 'Updated' };

      bracketsService.update.mockResolvedValue();

      await controller.update('bracket-id', updateBracketDto);

      expect(bracketsService.update).toHaveBeenCalledWith('bracket-id', updateBracketDto);
    });
  });

  describe('remove', () => {
    it('should remove a bracket', async () => {
      bracketsService.remove.mockResolvedValue();

      await controller.remove('bracket-id');

      expect(bracketsService.remove).toHaveBeenCalledWith('bracket-id');
    });
  });

  describe('addPlayer', () => {
    it('should add a player', async () => {
      const addPlayerDto = { userId: 'user-id', seeding: 1 };

      bracketsService.addPlayer.mockResolvedValue();
      bracketsService.generateBracket.mockResolvedValue();

      await controller.addPlayer('bracket-id', addPlayerDto);

      expect(bracketsService.addPlayer).toHaveBeenCalledWith('bracket-id', addPlayerDto);
      expect(bracketsService.generateBracket).toHaveBeenCalledWith('bracket-id');
    });
  });

  describe('removePlayer', () => {
    it('should remove a player', async () => {
      bracketsService.removePlayer.mockResolvedValue();

      await controller.removePlayer('bracket-id', 'user-id');

      expect(bracketsService.removePlayer).toHaveBeenCalledWith('bracket-id', 'user-id');
    });
  });

  describe('findPlayers', () => {
    it('should return players', async () => {
      const result = [{ id: 'bp-id' }];

      bracketsService.findPlayers.mockResolvedValue(result as any);

      expect(await controller.findPlayers('bracket-id')).toEqual(result);
      expect(bracketsService.findPlayers).toHaveBeenCalledWith('bracket-id');
    });
  });

  describe('findBracketMatches', () => {
    it('should return matches', async () => {
      const result = [{ id: 'match-id' }];

      bracketsService.findBracketMatches.mockResolvedValue(result as any);

      expect(await controller.findBracketMatches('bracket-id')).toEqual(result);
      expect(bracketsService.findBracketMatches).toHaveBeenCalledWith('bracket-id');
    });
  });
});
