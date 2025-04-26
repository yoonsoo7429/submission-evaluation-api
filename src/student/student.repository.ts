import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async createStudent(
    email: string,
    password: string,
    studentName: string,
  ): Promise<Student> {
    const student = this.studentRepository.create({
      email,
      password,
      studentName,
    });

    await this.studentRepository.save(student);
    return student;
  }

  async findOneStudent(email: string): Promise<Student> {
    return await this.studentRepository.findOne({
      where: { email },
    });
  }
}
