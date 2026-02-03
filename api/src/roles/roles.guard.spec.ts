import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { Role } from './enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByIdWithOrganizedTournaments: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: jest.Mocked<ExecutionContext>;

    beforeEach(() => {
      context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { sub: 'user-id' },
            params: {},
          }),
        }),
      } as any;
    });

    it('should return true if no required roles', async () => {
      reflector.getAllAndOverride.mockReturnValue(null);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return false if user is not tournament organizer for tournament', async () => {
      reflector.getAllAndOverride.mockReturnValue([Role.TOURNAMENT_ORGANIZER]);
      usersService.findOneByIdWithOrganizedTournaments.mockResolvedValue({
        organizedTournaments: [{ id: 'other-tournament' }],
      } as any);
      context.switchToHttp().getRequest().params = { tournamentId: 'tournament-id' };

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true if user is tournament organizer for tournament', async () => {
      reflector.getAllAndOverride.mockReturnValue([Role.TOURNAMENT_ORGANIZER]);
      usersService.findOneByIdWithOrganizedTournaments.mockResolvedValue({
        organizedTournaments: [{ id: 'tournament-id' }],
      } as any);
      context.switchToHttp().getRequest().params = { tournamentId: 'tournament-id' };

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true if user is tournament organizer for bracket', async () => {
      reflector.getAllAndOverride.mockReturnValue([Role.TOURNAMENT_ORGANIZER]);
      usersService.findOneByIdWithOrganizedTournaments.mockResolvedValue({
        organizedTournaments: [
          {
            id: 'tournament-id',
            brackets: [{ id: 'bracket-id' }],
          },
        ],
      } as any);
      context.switchToHttp().getRequest().params = { bracketId: 'bracket-id' };

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true if user is tournament organizer for match', async () => {
      reflector.getAllAndOverride.mockReturnValue([Role.TOURNAMENT_ORGANIZER]);
      usersService.findOneByIdWithOrganizedTournaments.mockResolvedValue({
        organizedTournaments: [
          {
            id: 'tournament-id',
            brackets: [
              {
                id: 'bracket-id',
                matches: [{ id: 'match-id' }],
              },
            ],
          },
        ],
      } as any);
      context.switchToHttp().getRequest().params = { matchId: 'match-id' };

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});