import { BadRequestException, Injectable } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async createSubmission(
    createSubmissionDto: CreateSubmissionDto,
    videoFile: Express.Multer.File,
    user: { userId: number },
  ) {
    if (!videoFile) {
      throw new BadRequestException('영상 파일이 존재하지 않습니다.');
    }

    //
  }
}
