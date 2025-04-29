import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Submission } from 'src/submission/entities/submission.entity';

@Entity('revisions')
export class Revision {
  @PrimaryGeneratedColumn({ name: 'revision_id' })
  revisionId: number;

  @ManyToOne(() => Submission)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
