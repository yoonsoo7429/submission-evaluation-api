import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Student } from 'src/student/entities/student.entity';
import { SubmissionMedia } from './entities/submission-media.entity';
import { SubmissionLog } from './entities/submission-log.entity';
import { SubmissionResult } from 'src/common/enum/submission-result.enum';

@Injectable()
export class SubmissionRepository {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(SubmissionMedia)
    private submissionMediaRepo: Repository<SubmissionMedia>,
    @InjectRepository(SubmissionLog)
    private submissionLogRepo: Repository<SubmissionLog>,
  ) {}

  async createSubmission(
    createSubmissionDto: CreateSubmissionDto,
    student: Student,
    queryRunner: QueryRunner,
  ) {
    const submission = this.submissionRepository.create({
      ...createSubmissionDto,
      student,
    });
    return await queryRunner.manager.save(submission);
  }

  async createSubmissionMedia(
    queryRunner: QueryRunner,
    submissionId: number,
    videoUrl: string,
    audioUrl: string,
    videoFileName: string,
    audioFileName: string,
  ): Promise<void> {
    await queryRunner.manager.save(SubmissionMedia, {
      submission: { submissionId },
      videoUrl,
      audioUrl,
      videoFileName,
      audioFileName,
    });
  }

  async createSubmissionLog(
    queryRunner: QueryRunner,
    submissionId: number,
    traceId: string,
    latency: number,
    result: SubmissionResult,
    message: string,
  ): Promise<void> {
    await queryRunner.manager.save(SubmissionLog, {
      submission: { submissionId },
      traceId,
      latency,
      result,
      message,
    });
  }

  async finalizeSubmission(
    queryRunner: QueryRunner,
    submissionId: number,
    updateData: Partial<Submission>,
  ): Promise<void> {
    await queryRunner.manager.update(Submission, { submissionId }, updateData);
  }
}
