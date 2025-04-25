import { Submission } from 'src/submission/entities/submission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'student_name' })
  studentName: string;

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions: Submission[];
}
