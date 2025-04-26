import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionMedia } from './entities/submission-media.entity';
import { SubmissionLog } from './entities/submission-log.entity';
import { StudentModule } from 'src/student/student.module';
import { SubmissionRepository } from './submission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, SubmissionMedia, SubmissionLog]),
    StudentModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionRepository],
})
export class SubmissionModule {}
