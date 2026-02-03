import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      signIn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call authService.signIn with correct parameters', async () => {
      const signInDto = { email: 'test@example.com', password: 'password' };
      const result = { access_token: 'token' };
      authService.signIn.mockResolvedValue(result);

      const response = await controller.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password');
      expect(response).toBe(result);
    });
  });

  describe('getProfile', () => {
    it('should return the user from request', () => {
      const req = { user: { id: '1', email: 'test@example.com' } };

      const result = controller.getProfile(req);

      expect(result).toBe(req.user);
    });
  });
});
