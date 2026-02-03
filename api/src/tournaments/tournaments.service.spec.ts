import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsService } from './tournaments.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';

describe('TournamentsService', () => {
  let service: TournamentsService;
  let usersService: jest.Mocked<UsersService>;
  let repository: jest.Mocked<Repository<Tournament>>;

  beforeEach(async () => {
    const mockUsersService = {
      findOneById: jest.fn(),
    };
    const mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentsService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(Tournament),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);
    usersService = module.get(UsersService);
    repository = module.get(getRepositoryToken(Tournament));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tournament', async () => {
      const createTournamentDto = { name: 'Test Tournament', description: 'Desc', organizerId: '1' };
      const organizer = { id: '1', name: 'Organizer' };
      const savedTournament = { id: '1', name: 'Test Tournament', description: 'Desc', organizer };

      usersService.findOneById.mockResolvedValue(organizer);
      repository.save.mockResolvedValue(savedTournament);

      const result = await service.create(createTournamentDto);

      expect(usersService.findOneById).toHaveBeenCalledWith('1');
      expect(repository.save).toHaveBeenCalledWith({
        name: 'Test Tournament',
        description: 'Desc',
        organizer,
      });
      expect(result).toBe(savedTournament);
    });
  });

  describe('findOneById', () => {
    it('should return tournament if found', async () => {
      const tournament = { id: '1', name: 'Test', brackets: [] };
      repository.findOne.mockResolvedValue(tournament);

      const result = await service.findOneById('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { brackets: true },
      });
      expect(result).toBe(tournament);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneById('1')).rejects.toThrow('Tournament not found');
    });
  });

  describe('findAll', () => {
    it('should return all tournaments', async () => {
      const tournaments = [{ id: '1', name: 'Test' }];
      repository.find.mockResolvedValue(tournaments);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(tournaments);
    });
  });

  describe('findByName', () => {
    it('should return tournaments by name', async () => {
      const tournaments = [{ id: '1', name: 'Test' }];
      repository.find.mockResolvedValue(tournaments);

      const result = await service.findByName('Test');

      expect(repository.find).toHaveBeenCalledWith({ where: { name: 'Test' } });
      expect(result).toBe(tournaments);
    });
  });

  describe('update', () => {
    it('should update tournament name and description', async () => {
      const tournament = { id: '1', name: 'Old', description: 'Old desc' };
      const updateTournamentDto = { name: 'New', description: 'New desc' };
      repository.findOne.mockResolvedValue(tournament);
      repository.save.mockResolvedValue(tournament);

      await service.update('1', updateTournamentDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { brackets: true },
      });
      expect(repository.save).toHaveBeenCalledWith({ id: '1', name: 'New', description: 'New desc' });
    });

    it('should update only name if description not provided', async () => {
      const tournament = { id: '1', name: 'Old', description: 'Old desc' };
      const updateTournamentDto = { name: 'New' };
      repository.findOne.mockResolvedValue(tournament);
      repository.save.mockResolvedValue(tournament);

      await service.update('1', updateTournamentDto);

      expect(repository.save).toHaveBeenCalledWith({ id: '1', name: 'New', description: 'Old desc' });
    });

    it('should update only description if name not provided', async () => {
      const tournament = { id: '1', name: 'Old', description: 'Old desc' };
      const updateTournamentDto = { description: 'New desc' };
      repository.findOne.mockResolvedValue(tournament);
      repository.save.mockResolvedValue(tournament);

      await service.update('1', updateTournamentDto);

      expect(repository.save).toHaveBeenCalledWith({ id: '1', name: 'Old', description: 'New desc' });
    });
  });

  describe('remove', () => {
    it('should delete tournament', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  });
});
