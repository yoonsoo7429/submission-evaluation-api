import { Student } from 'src/student/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubmissionMedia } from './submission-media.entity';
import { SubmissionLog } from './submission-log.entity';
import { Revision } from 'src/revision/entities/revision.entity';
import { ComponentType } from 'src/common/enum/component-type.enum';
import { SubmissionStatus } from 'src/common/enum/submission-status.enum';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn({ name: 'submission_id' })
  submissionId: number;

  @ManyToOne(() => Student, (student) => student.submissions)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'enum', enum: ComponentType })
  componentType: ComponentType;

  @Column({ name: 'submit_text', type: 'text' })
  submitText: string;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true, type: 'text' })
  feedback: string;

  @Column({ type: 'jsonb', nullable: true })
  highlights: string[];

  @Column({ name: 'highlight_submit_text', type: 'text', nullable: true })
  highlightSubmitText: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => SubmissionMedia, (media) => media.submission)
  media: SubmissionMedia[];

  @OneToMany(() => SubmissionLog, (log) => log.submission)
  logs: SubmissionLog[];

  @OneToMany(() => Revision, (revision) => revision.submission)
  revisions: Revision[];
}
