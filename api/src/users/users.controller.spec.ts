import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findOneByName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with correct dto', async () => {
      const createUserDto = { name: 'Test', email: 'test@example.com', password: 'password' };
      const result = { id: '1', name: 'Test', email: 'test@example.com' };
      usersService.create.mockResolvedValue(result);

      const response = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(response).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll', async () => {
      const users = [{ id: '1', name: 'Test' }];
      usersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toBe(users);
    });
  });

  describe('findOneById', () => {
    it('should call usersService.findOneById with correct id', async () => {
      const user = { id: '1', name: 'Test' };
      usersService.findOneById.mockResolvedValue(user);

      const result = await controller.findOneById('1');

      expect(usersService.findOneById).toHaveBeenCalledWith('1');
      expect(result).toBe(user);
    });
  });

  describe('findOneByName', () => {
    it('should call usersService.findOneByName with correct username', async () => {
      const user = { id: '1', name: 'Test' };
      usersService.findOneByName.mockResolvedValue(user);

      const result = await controller.findOneByName('Test');

      expect(usersService.findOneByName).toHaveBeenCalledWith('Test');
      expect(result).toBe(user);
    });
  });
});
