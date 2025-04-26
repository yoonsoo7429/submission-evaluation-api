import { BadRequestException, Injectable } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { StudentRepository } from 'src/student/student.repository';
import { DataSource } from 'typeorm';
import { VideoProcessorService } from 'src/common/services/video-processor.service';
import { AzureBlobService } from 'src/common/services/azure-blob.service';
import { OpenAIService } from 'src/common/services/openai.service';
import { generateHighlightText } from 'src/common/utils/highlight.util';
import { v4 as uuidv4 } from 'uuid';
import { SubmissionResult } from 'src/common/enum/submission-result.enum';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly studentRepositody: StudentRepository,
    private readonly videoProcessorService: VideoProcessorService,
    private readonly azureBlobSerivce: AzureBlobService,
    private readonly openaiService: OpenAIService,
    private readonly dataSource: DataSource,
  ) {}

  async createSubmission(
    createSubmissionDto: CreateSubmissionDto,
    videoFile: Express.Multer.File,
    user: { studentId: number; email: string },
  ) {
    if (!videoFile) throw new BadRequestException('영상 파일이 필요합니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const student = await this.studentRepositody.findStudentByPk(
      user.studentId,
    );

    const submission = await this.submissionRepository.createSubmission(
      createSubmissionDto,
      student,
      queryRunner,
    );

    const traceId = uuidv4();
    try {
      // 영상 전처리
      const croppedVideo = await this.videoProcessorService.cropVideo(
        videoFile.path,
      );

      // 병렬 처리 (Azure 업로드 + OpenAI 평가)
      const [audioFile, videoUrl, aiResult] = await Promise.all([
        this.videoProcessorService.extractAudio(croppedVideo),
        this.azureBlobSerivce.uploadFile(
          croppedVideo,
          `video-${submission.submissionId}.mp4`,
        ),
        this.openaiService.evaluate(createSubmissionDto.submitText),
      ]);

      const audioUrl = await this.azureBlobSerivce.uploadFile(
        audioFile,
        `audio-${submission.submissionId}.mp3`,
      );

      // 제출 미디어 저장장
      await this.submissionRepository.createSubmissionMedia(
        queryRunner,
        submission.submissionId,
        videoUrl,
        audioUrl,
        videoFile.originalname,
        audioFile.split('/').pop()!,
      );

      // 하이라이트 텍스트 생성
      const highlightSubmitText = generateHighlightText(
        createSubmissionDto.submitText,
        aiResult.highlights,
      );

      // 제출 결과 업데이트
      await this.submissionRepository.finalizeSubmission(
        queryRunner,
        submission.submissionId,
        {
          score: aiResult.score,
          feedback: aiResult.feedback,
          highlights: aiResult.highlights,
          highlightSubmitText,
        },
      );

      //  제출 로그 저장 (성공 시)
      await this.submissionRepository.createSubmissionLog(
        queryRunner,
        submission.submissionId,
        traceId,
        aiResult.latency,
        SubmissionResult.OK,
        '평가 성공',
      );

      // 9. 커밋
      await queryRunner.commitTransaction();

      // 10. 임시 파일 삭제
      await this.videoProcessorService.deleteTempFiles(
        videoFile.path,
        croppedVideo,
        audioFile,
      );

      return {
        result: 'ok',
        message: null,
        studentId: student.studentId,
        studentName: student.studentName,
        score: aiResult.score,
        feedback: aiResult.feedback,
        highlights: aiResult.highlights,
        submitText: createSubmissionDto.submitText,
        highlightSubmitText,
        mediaUrl: {
          video: videoUrl,
          audio: audioUrl,
        },
        apiLatency: aiResult.latency,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // 저장 실패 시 (log 남기기)
      try {
        await this.submissionRepository.createSubmissionLog(
          queryRunner,
          submission?.submissionId || 0,
          traceId,
          0,
          SubmissionResult.FAILED,
          'OpenAI 요청 실패: ' + (error.message || 'Unknown error'),
        );
      } catch (logError) {}
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
