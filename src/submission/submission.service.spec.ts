import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';
import { StudentRepository } from 'src/student/student.repository';
import { VideoProcessorService } from 'src/common/services/video-processor.service';
import { AzureBlobService } from 'src/common/services/azure-blob.service';
import { OpenAIService } from 'src/common/services/openai.service';
import { DataSource } from 'typeorm';
import {
  mockSubmission,
  MockSubmissionRepository,
} from '../common/mocks/submission.repository.mock';
import {
  mockStudent,
  MockStudentRepository,
} from 'src/common/mocks/student.repository.mock';
import { BadRequestException } from '@nestjs/common';
import { MockDataSource } from 'src/common/mocks/datasource.mock';

describe('SubmissionService', () => {
  let service: SubmissionService;
  let submissionRepository: SubmissionRepository;
  let studentRepository: StudentRepository;
  let videoProcessorService: VideoProcessorService;
  let azureBlobService: AzureBlobService;
  let openaiService: OpenAIService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionService,
        { provide: SubmissionRepository, useValue: MockSubmissionRepository },
        { provide: StudentRepository, useValue: MockStudentRepository },
        {
          provide: VideoProcessorService,
          useValue: {
            cropVideo: jest.fn(),
            extractAudio: jest.fn(),
            deleteTempFiles: jest.fn(),
          },
        },
        { provide: AzureBlobService, useValue: { uploadFile: jest.fn() } },
        { provide: OpenAIService, useValue: { evaluate: jest.fn() } },
        { provide: DataSource, useValue: MockDataSource },
      ],
    }).compile();

    service = module.get<SubmissionService>(SubmissionService);
    submissionRepository =
      module.get<SubmissionRepository>(SubmissionRepository);
    studentRepository = module.get<StudentRepository>(StudentRepository);
    videoProcessorService = module.get<VideoProcessorService>(
      VideoProcessorService,
    );
    azureBlobService = module.get<AzureBlobService>(AzureBlobService);
    openaiService = module.get<OpenAIService>(OpenAIService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if videoFile is missing', async () => {
    await expect(
      service.createSubmission({ submitText: 'test' } as any, null, {
        studentId: 1,
        email: 'test@test.com',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should call createSubmission with correct data', async () => {
    // given
    (studentRepository.findStudentByPk as jest.Mock).mockResolvedValue(
      mockStudent,
    );
    (submissionRepository.createSubmission as jest.Mock).mockResolvedValue(
      mockSubmission,
    );

    const fakeVideoFile = {
      path: 'path/to/video',
      originalname: 'test.mp4',
    } as Express.Multer.File;
    const fakeOpenAIResult = {
      score: 90,
      feedback: 'Great job!',
      highlights: ['good', 'excellent'],
      latency: 123,
    };

    (studentRepository.findStudentByPk as jest.Mock).mockResolvedValue(
      mockStudent,
    );
    (submissionRepository.createSubmission as jest.Mock).mockResolvedValue(
      mockSubmission,
    );
    (videoProcessorService.cropVideo as jest.Mock).mockResolvedValue(
      'path/to/cropped.mp4',
    );
    (videoProcessorService.extractAudio as jest.Mock).mockResolvedValue(
      'path/to/audio.mp3',
    );
    (azureBlobService.uploadFile as jest.Mock).mockResolvedValue(
      'https://example.com/file',
    );
    (openaiService.evaluate as jest.Mock).mockResolvedValue(fakeOpenAIResult);

    // when
    const result = await service.createSubmission(
      { submitText: 'I love studying.' } as any,
      fakeVideoFile,
      { studentId: 1, email: 'test@test.com' },
    );

    // then
    expect(result.result).toBe('ok');
    expect(result.studentId).toBe(mockStudent.studentId);
    expect(result.score).toBe(fakeOpenAIResult.score);
  });
});
