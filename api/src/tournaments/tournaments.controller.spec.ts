import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

describe('TournamentsController', () => {
  let controller: TournamentsController;
  let tournamentsService: jest.Mocked<TournamentsService>;

  beforeEach(async () => {
    const mockTournamentsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentsController],
      providers: [
        {
          provide: TournamentsService,
          useValue: mockTournamentsService,
        },
      ],
    }).compile();

    controller = module.get<TournamentsController>(TournamentsController);
    tournamentsService = module.get(TournamentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call tournamentsService.create', async () => {
      const createTournamentDto = { name: 'Test', description: 'Desc', organizerId: '1' };
      const result = { id: '1', name: 'Test' };
      tournamentsService.create.mockResolvedValue(result);

      const response = await controller.create(createTournamentDto);

      expect(tournamentsService.create).toHaveBeenCalledWith(createTournamentDto);
      expect(response).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should call tournamentsService.findAll', async () => {
      const tournaments = [{ id: '1', name: 'Test' }];
      tournamentsService.findAll.mockResolvedValue(tournaments);

      const result = await controller.findAll();

      expect(tournamentsService.findAll).toHaveBeenCalled();
      expect(result).toBe(tournaments);
    });
  });

  describe('findOne', () => {
    it('should call tournamentsService.findOneById', async () => {
      const tournament = { id: '1', name: 'Test' };
      tournamentsService.findOneById.mockResolvedValue(tournament);

      const result = await controller.findOne('1');

      expect(tournamentsService.findOneById).toHaveBeenCalledWith('1');
      expect(result).toBe(tournament);
    });
  });

  describe('findByName', () => {
    it('should call tournamentsService.findByName', async () => {
      const tournaments = [{ id: '1', name: 'Test' }];
      tournamentsService.findByName.mockResolvedValue(tournaments);

      const result = await controller.findByName('Test');

      expect(tournamentsService.findByName).toHaveBeenCalledWith('Test');
      expect(result).toBe(tournaments);
    });
  });
});
