import { Module } from '@nestjs/common';
import { RevisionController } from './revision.controller';
import { RevisionService } from './revision.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Revision } from './entities/revision.entity';
import { SubmissionModule } from 'src/submission/submission.module';
import { RevisionRepository } from './revision.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Revision]), SubmissionModule],
  controllers: [RevisionController],
  providers: [RevisionService, RevisionRepository],
})
export class RevisionModule {}
