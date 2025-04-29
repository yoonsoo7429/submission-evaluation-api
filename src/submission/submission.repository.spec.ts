import { SubmissionRepository } from './submission.repository';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionMedia } from './entities/submission-media.entity';
import { SubmissionLog } from './entities/submission-log.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Student } from 'src/student/entities/student.entity';
import { SubmissionResult } from 'src/common/enum/submission-result.enum';
import { SubmissionStatus } from 'src/common/enum/submission-status.enum';
import { ComponentType } from 'src/common/enum/component-type.enum';

describe('SubmissionRepository', () => {
  let repository: SubmissionRepository;
  let submissionRepo: Repository<Submission>;
  let submissionMediaRepo: Repository<SubmissionMedia>;
  let submissionLogRepo: Repository<SubmissionLog>;
  let mockQueryRunner: any;

  beforeEach(() => {
    submissionRepo = {
      create: jest.fn().mockImplementation((data) => data),
    } as any;

    submissionMediaRepo = {} as any;
    submissionLogRepo = {} as any;

    repository = new SubmissionRepository(
      submissionRepo,
      submissionMediaRepo,
      submissionLogRepo,
    );

    mockQueryRunner = {
      manager: {
        save: jest.fn(),
        update: jest.fn(),
      },
    };
  });

  it('should create a submission', async () => {
    const dto = {
      submitText: 'test',
      componentType: ComponentType.ESSAY,
    } as CreateSubmissionDto;
    const student = { studentId: 1 } as Student;

    await repository.createSubmission(dto, student, mockQueryRunner);

    expect(submissionRepo.create).toHaveBeenCalledWith({
      ...dto,
      student,
    });
    expect(mockQueryRunner.manager.save).toHaveBeenCalled();
  });

  it('should create submission media', async () => {
    await repository.createSubmissionMedia(
      mockQueryRunner,
      1,
      'videoUrl',
      'audioUrl',
      'videoFileName',
      'audioFileName',
    );

    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(SubmissionMedia, {
      submission: { submissionId: 1 },
      videoUrl: 'videoUrl',
      audioUrl: 'audioUrl',
      videoFileName: 'videoFileName',
      audioFileName: 'audioFileName',
    });
  });

  it('should create submission log', async () => {
    await repository.createSubmissionLog(
      mockQueryRunner,
      1,
      'traceId',
      1234,
      SubmissionResult.OK,
      'Success',
    );

    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(SubmissionLog, {
      submission: { submissionId: 1 },
      traceId: 'traceId',
      latency: 1234,
      result: SubmissionResult.OK,
      message: 'Success',
    });
  });

  it('should finalize submission', async () => {
    await repository.finalizeSubmission(mockQueryRunner, 1, {
      status: SubmissionStatus.COMPLETED,
    });

    expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
      Submission,
      { submissionId: 1 },
      { status: SubmissionStatus.COMPLETED },
    );
  });
});
