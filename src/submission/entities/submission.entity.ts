import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { SubmissionMedia } from './submission-media.entity';
import { SubmissionLog } from './submission-log.entity';
import { SubmissionStatus } from 'src/common/enum/submission-status.enum';
import { ComponentType } from 'src/common/enum/component-type.enum';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn({ name: 'submission_id' })
  submissionId: number;

  @ManyToOne(() => Student, (student) => student.submissions)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'component_type' })
  componentType: ComponentType;

  @Column({ name: 'submit_text', type: 'text' })
  submitText: string;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true, type: 'text' })
  feedback: string;

  @Column({ nullable: true, type: 'jsonb' })
  highlights: string[];

  @Column({ name: 'highlight_submit_text', nullable: true, type: 'text' })
  highlightSubmitText: string;

  @Column({ type: 'varchar', default: SubmissionStatus.PENDING })
  status: SubmissionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => SubmissionMedia, (media) => media.submission)
  media: SubmissionMedia[];

  @OneToMany(() => SubmissionLog, (log) => log.submission)
  logs: SubmissionLog[];
}
