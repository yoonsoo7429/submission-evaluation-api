import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from 'fs';

@Module({
  imports: [TypeOrmModule.forFeature([Stats])],
  providers: [StatsService],
})
export class StatsModule {}
