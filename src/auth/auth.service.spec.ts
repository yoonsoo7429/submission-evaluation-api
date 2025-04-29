import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import {
  MockStudentRepository,
  mockStudent,
} from 'src/common/mocks/student.repository.mock';
import * as bcrypt from 'bcrypt';
import { StudentRepository } from 'src/student/student.repository';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

// JwtService Mock
const MockJwtService = {
  sign: jest.fn(),
};

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let studentRepository: StudentRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: MockJwtService },
        { provide: StudentRepository, useValue: MockStudentRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    studentRepository = module.get(StudentRepository);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new student', async () => {
      // given
      const signupDto: SignupDto = {
        email: 'new@test.com',
        password: 'password123',
        studentName: 'New Student',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('mockHashedPassword');
      (studentRepository.createStudent as jest.Mock).mockResolvedValue({
        ...mockStudent,
        email: signupDto.email,
        studentName: signupDto.studentName,
      });

      // when
      const result = await service.signup(signupDto);

      // then
      expect(studentRepository.createStudent).toHaveBeenCalledWith(
        signupDto.email,
        expect.any(String),
        signupDto.studentName,
      );
      expect(result.email).toBe(signupDto.email);
      expect(result.studentName).toBe(signupDto.studentName);
    });
  });

  describe('login', () => {
    it('should return accessToken if login succeeds', async () => {
      // given
      const loginDto: LoginDto = {
        email: mockStudent.email,
        password: 'testpassword',
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('mockAccessToken');

      // when
      const result = await service.login(loginDto);

      // then
      expect(result).toEqual({
        result: 'ok',
        message: null,
        accessToken: 'mockAccessToken',
      });
    });

    it('should throw UnauthorizedException if email not found', async () => {
      // given
      (studentRepository.findStudentByEmail as jest.Mock).mockResolvedValue(
        null,
      );

      const loginDto = { email: 'notexist@test.com', password: 'password' };

      // when / then
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password mismatch', async () => {
      // given
      const loginDto = { email: mockStudent.email, password: 'wrongpassword' };

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // when / then
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
