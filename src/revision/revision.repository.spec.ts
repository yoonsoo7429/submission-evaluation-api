import { RevisionRepository } from './revision.repository';
import { Revision } from './entities/revision.entity';
import { Repository } from 'typeorm';

describe('RevisionRepository', () => {
  let repository: RevisionRepository;
  let mockRevisionRepository: jest.Mocked<Repository<Revision>>;

  beforeEach(() => {
    mockRevisionRepository = {} as any;

    repository = new RevisionRepository(mockRevisionRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
