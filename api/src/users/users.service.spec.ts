import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return without passwordHash', async () => {
      const createUserDto = { name: 'Test', email: 'test@example.com', password: 'password' };
      const savedUser = { id: '1', name: 'Test', email: 'test@example.com', passwordHash: 'hashed' };
      repository.save.mockResolvedValue(savedUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(repository.save).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@example.com',
        passwordHash: 'hashed',
      });
      expect(result).toEqual({ id: '1', name: 'Test', email: 'test@example.com' });
    });
  });

  describe('findOneByEmail', () => {
    it('should return user if found', async () => {
      const user = { id: '1', name: 'Test', email: 'test@example.com', passwordHash: 'hash' };
      repository.findOne.mockResolvedValue(user);

      const result = await service.findOneByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: { id: true, name: true, email: true, passwordHash: true },
      });
      expect(result).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneByEmail('test@example.com')).rejects.toThrow('User not found');
    });
  });

  describe('findOneById', () => {
    it('should return user if found', async () => {
      const user = { id: '1', name: 'Test', email: 'test@example.com' };
      repository.findOne.mockResolvedValue(user);

      const result = await service.findOneById('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneById('1')).rejects.toThrow('User not found');
    });
  });

  describe('findOneByName', () => {
    it('should return user if found', async () => {
      const user = { id: '1', name: 'Test', email: 'test@example.com' };
      repository.findOne.mockResolvedValue(user);

      const result = await service.findOneByName('Test');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'Test' } });
      expect(result).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneByName('Test')).rejects.toThrow('User not found');
    });
  });

  describe('findOneByIdWithOrganizedTournaments', () => {
    it('should return user with organized tournaments if found', async () => {
      const user = { id: '1', organizedTournaments: [] };
      repository.findOne.mockResolvedValue(user);

      const result = await service.findOneByIdWithOrganizedTournaments('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          organizedTournaments: {
            id: true,
            brackets: { id: true, matches: { id: true } },
          },
        },
        relations: { organizedTournaments: { brackets: { matches: true } } },
      });
      expect(result).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneByIdWithOrganizedTournaments('1')).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update user name and email', async () => {
      const user = { id: '1', name: 'Old', email: 'old@example.com' };
      const updateUserDto = { name: 'New', email: 'new@example.com' };
      repository.findOne.mockResolvedValue(user);
      repository.save.mockResolvedValue(user);

      await service.update('1', updateUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.save).toHaveBeenCalledWith({ id: '1', name: 'New', email: 'new@example.com' });
    });

    it('should update only name if email not provided', async () => {
      const user = { id: '1', name: 'Old', email: 'old@example.com' };
      const updateUserDto = { name: 'New' };
      repository.findOne.mockResolvedValue(user);
      repository.save.mockResolvedValue(user);

      await service.update('1', updateUserDto);

      expect(repository.save).toHaveBeenCalledWith({ id: '1', name: 'New', email: 'old@example.com' });
    });

    it('should update only email if name not provided', async () => {
      const user = { id: '1', name: 'Old', email: 'old@example.com' };
      const updateUserDto = { email: 'new@example.com' };
      repository.findOne.mockResolvedValue(user);
      repository.save.mockResolvedValue(user);

      await service.update('1', updateUserDto);

      expect(repository.save).toHaveBeenCalledWith({ id: '1', name: 'Old', email: 'new@example.com' });
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  });
});
