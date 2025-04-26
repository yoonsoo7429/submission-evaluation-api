import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from 'fs';
import { StatsRepository } from './stats.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Stats])],
  providers: [StatsService, StatsRepository],
})
export class StatsModule {}
