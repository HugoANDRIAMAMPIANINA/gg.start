import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersService = {
      findOneByEmail: jest.fn(),
    };
    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token for valid credentials', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedpassword',
        organizedTournaments: [],
      };
      usersService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('token');

      const result = await service.signIn('test@example.com', 'password');

      expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@example.com',
        username: 'Test User',
        organizedTournaments: [],
      });
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedpassword',
        organizedTournaments: [],
      };
      usersService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });
});
