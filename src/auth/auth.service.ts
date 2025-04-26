import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentRepository } from 'src/student/student.repository';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { Student } from 'src/student/entities/student.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly studentRepository: StudentRepository,
  ) {}

  async signup(body: SignupDto): Promise<Student> {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    return await this.studentRepository.createStudent(
      body.email,
      hashedPassword,
      body.studentName,
    );
  }

  async login(body: LoginDto) {
    const student = await this.studentRepository.findOneStudent(body.email);
    if (!student)
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');

    const isMatch = await bcrypt.compare(body.password, student.password);
    if (!isMatch)
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');

    const payload = { studentId: student.studentId, email: student.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      result: 'ok',
      message: null,
      accessToken,
    };
  }
}
