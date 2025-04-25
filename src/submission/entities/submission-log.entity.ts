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

  @Column({ name: 'trace_id' })
  traceId: string;

  @Column()
  latency: number;

  @Column({ type: 'enum', enum: SubmissionResult })
  result: SubmissionResult;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
