import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

// Mock AuthService 생성
const MockAuthService = {
  signup: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: MockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with correct body', async () => {
      // given
      const signupDto: SignupDto = {
        email: 'test@test.com',
        password: 'password123',
        studentName: 'Test Student',
      };

      const expectedResult = { studentId: 1, ...signupDto };

      (authService.signup as jest.Mock).mockResolvedValue(expectedResult);

      // when
      const result = await controller.signup(signupDto);

      // then
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct body', async () => {
      // given
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const expectedResult = {
        result: 'ok',
        message: null,
        accessToken: 'fake-jwt-token',
      };

      (authService.login as jest.Mock).mockResolvedValue(expectedResult);

      // when
      const result = await controller.login(loginDto);

      // then
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
