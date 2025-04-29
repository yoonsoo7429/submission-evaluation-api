import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Submission } from './submission.entity';
import { SubmissionResult } from 'src/common/enum/submission-result.enum';

@Entity('submission_logs')
export class SubmissionLog {
  @PrimaryGeneratedColumn({ name: 'log_id' })
  logId: number;

  @ManyToOne(() => Submission, (submission) => submission.logs)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ name: 'trace_id', type: 'uuid' })
  traceId: string;

  @Column({ nullable: true })
  latency: number;

  @Column({ type: 'varchar' })
  result: SubmissionResult;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
