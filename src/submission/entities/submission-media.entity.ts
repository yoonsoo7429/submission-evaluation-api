import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity('submission_media')
export class SubmissionMedia {
  @PrimaryGeneratedColumn({ name: 'media_id' })
  mediaId: number;

  @OneToOne(() => Submission, (submission) => submission.media)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ name: 'video_url' })
  videoUrl: string;

  @Column({ name: 'audio_url' })
  audioUrl: string;

  @Column({ name: 'video_file_name' })
  videoFileName: string;

  @Column({ name: 'audio_file_name' })
  audioFileName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
