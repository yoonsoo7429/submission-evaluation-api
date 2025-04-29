import { Submission } from '../../submission/entities/submission.entity';
import { ComponentType } from '../enum/component-type.enum';
import { SubmissionStatus } from '../enum/submission-status.enum';
import { mockStudent } from './student.repository.mock';
import { SubmissionMedia } from 'src/submission/entities/submission-media.entity';
import { SubmissionLog } from 'src/submission/entities/submission-log.entity';
import { SubmissionResult } from '../enum/submission-result.enum';

export const mockSubmission: Submission = {
  submissionId: 1,
  student: mockStudent,
  componentType: ComponentType.ESSAY,
  submitText: 'I want to improve my writing.',
  score: 2,
  feedback: 'Good structure but minor grammatical errors.',
  highlights: ['misspelled word', 'wrong tense usage'],
  highlightSubmitText: 'I want to <b>improve</b> my writing.',
  status: SubmissionStatus.COMPLETED,
  createdAt: new Date(),
  updatedAt: new Date(),
  media: [],
  logs: [],
  revisions: [],
};

export const mockSubmissionMedia: SubmissionMedia = {
  mediaId: 1,
  submission: mockSubmission,
  videoUrl:
    'https://devtaskblob.blob.core.windows.net/task/video-1.mp4?sv=2025-05-05&se=2025-04-29T02%3A55%3A59Z&sr=b&sp=r&sig=ghNxz03GANm5pTiVwfWUTJ01WDdj4vx%2FOnonbAv0eoQ%3D',
  audioUrl:
    'https://devtaskblob.blob.core.windows.net/task/audio-1.mp3?sv=2025-05-05&se=2025-04-29T02%3A55%3A59Z&sr=b&sp=r&sig=2HqmZOsXCU2YVdue4M%2B212PlPIyJTiQzeUFGNpiKlE4%3D',
  videoFileName: 'movie_1.mp4',
  audioFileName: 'c3b522d3-286b-4baf-a56b-385e135a4a79-audio.mp3',
  createdAt: new Date(),
};

export const mockSubmissionLog: SubmissionLog = {
  logId: 1,
  submission: mockSubmission,
  traceId: '32b7d643-806e-423b-99b6-6054800d2413',
  latency: 1432,
  result: SubmissionResult.OK,
  message: '평가 성공',
  createdAt: new Date(),
};

export const MockSubmissionRepository = {
  createSubmission: jest.fn().mockResolvedValue(mockSubmission),
  createSubmissionMedia: jest.fn().mockResolvedValueOnce(mockSubmissionMedia),
  finalizeSubmission: jest.fn().mockResolvedValue(undefined),
  createSubmissionLog: jest.fn().mockResolvedValue(mockSubmissionLog),
};
