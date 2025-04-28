import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Submissions')
@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: '에세이 제출 성공',
    schema: {
      example: {
        result: 'ok',
        message: null,
        studentId: 1,
        studentName: 'Jane Doe',
        score: 8,
        feedback: 'Good structure but minor grammatical errors.',
        highlights: ['misspelled word', 'wrong tense usage'],
        submitText: 'I want to improve my writing.',
        highlightSubmitText: 'I want to <b>improve</b> my writing.',
        mediaUrl: {
          video: 'https://example.blob.core.windows.net/container/video-1.mp4',
          audio: 'https://example.blob.core.windows.net/container/audio-1.mp3',
        },
        apiLatency: 1432,
      },
    },
  })
  @Post()
  @ApiOperation({ summary: '에세이 제출 및 평가 요청' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '에세이 제출 form',
    schema: {
      type: 'object',
      properties: {
        submitText: {
          type: 'string',
          example: 'I want to improve my writing.',
        },
        componentType: {
          type: 'string',
          enum: ['Essay Writing', 'Speaking'],
        },
        videoFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('videoFile', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createSubmission(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @UploadedFile() videoFile: Express.Multer.File,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.submissionService.createSubmission(
      createSubmissionDto,
      videoFile,
      user,
    );
  }
}
