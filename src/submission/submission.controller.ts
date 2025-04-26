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
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('Submissions')
@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiBearerAuth()
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
  @UseInterceptors(FileInterceptor('videoFile'))
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
