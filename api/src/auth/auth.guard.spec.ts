import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get(JwtService);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: jest.Mocked<ExecutionContext>;
    let request: any;

    beforeEach(() => {
      request = {
        headers: {},
        user: undefined,
      };
      context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(request),
        }),
      } as any;
    });

    it('should return true if route is public', async () => {
      reflector.getAllAndOverride.mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should throw UnauthorizedException if no token', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      request.headers.authorization = undefined;

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if invalid token type', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      request.headers.authorization = 'Basic token';

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      request.headers.authorization = 'Bearer token';
      jwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should set user and return true if token is valid', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      request.headers.authorization = 'Bearer token';
      const payload = { sub: 'user-id' };
      jwtService.verifyAsync.mockResolvedValue(payload);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(request.user).toEqual(payload);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('token');
    });
  });
});