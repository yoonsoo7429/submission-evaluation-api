import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ComponentType } from 'src/common/enum/component-type.enum';

const MockSubmissionService = {
  createSubmission: jest.fn(),
};

describe('SubmissionController', () => {
  let controller: SubmissionController;
  let submissionService: SubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [
        { provide: SubmissionService, useValue: MockSubmissionService },
      ],
    }).compile();

    controller = module.get<SubmissionController>(SubmissionController);
    submissionService = module.get<SubmissionService>(SubmissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSubmission', () => {
    it('should call submissionService.createSubmission with correct params', async () => {
      // given
      const createSubmissionDto: CreateSubmissionDto = {
        submitText: 'I want to improve my writing.',
        componentType: ComponentType.ESSAY,
      };

      const videoFile = {
        originalname: 'test.mp4',
        path: 'uploads/test.mp4',
      } as Express.Multer.File;

      const user = { studentId: 1, email: 'test@test.com' };

      const expectedResult = {
        result: 'ok',
        message: null,
        studentId: 1,
        studentName: 'Jane Doe',
        score: 8,
        feedback: 'Good job!',
        highlights: ['excellent'],
        submitText: 'I want to improve my writing.',
        highlightSubmitText: 'I want to <b>improve</b> my writing.',
        mediaUrl: {
          video: 'https://example.blob.core.windows.net/container/video-1.mp4',
          audio: 'https://example.blob.core.windows.net/container/audio-1.mp3',
        },
        apiLatency: 1234,
      };

      (submissionService.createSubmission as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      // when
      const result = await controller.createSubmission(
        createSubmissionDto,
        videoFile,
        { user },
      );

      // then
      expect(submissionService.createSubmission).toHaveBeenCalledWith(
        createSubmissionDto,
        videoFile,
        user,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
