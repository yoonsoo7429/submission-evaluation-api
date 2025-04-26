import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentRepository } from './student.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentRepository],
  exports: [StudentRepository],
})
export class StudentModule {}
