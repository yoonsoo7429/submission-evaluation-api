import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Revision } from './entities/revision.entity';

@Injectable()
export class RevisionRepository {
  constructor(
    @InjectRepository(Revision)
    private revisionRepository: Repository<Revision>,
  ) {}
}
