import { Submission } from 'src/submission/entities/submission.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('revisions')
export class Revision {
  @PrimaryGeneratedColumn({ name: 'revision_id' })
  revisionId: number;

  @ManyToOne(() => Submission, (submission) => submission.revisions)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
