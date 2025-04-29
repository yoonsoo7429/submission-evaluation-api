import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stats } from './entities/stats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectRepository(Stats)
    private statsRepository: Repository<Stats>,
  ) {}
}
