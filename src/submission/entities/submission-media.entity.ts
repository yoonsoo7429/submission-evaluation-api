import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity('submission_media')
export class SubmissionMedia {
  @PrimaryGeneratedColumn({ name: 'media_id' })
  mediaId: number;

  @ManyToOne(() => Submission, (submission) => submission.media)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ name: 'video_url', type: 'text' })
  videoUrl: string;

  @Column({ name: 'audio_url', type: 'text' })
  audioUrl: string;

  @Column({ name: 'video_file_name', nullable: true })
  videoFileName: string;

  @Column({ name: 'audio_file_name', nullable: true })
  audioFileName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
