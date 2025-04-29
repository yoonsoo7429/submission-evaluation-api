import { StatsRepository } from './stats.repository';
import { Stats } from './entities/stats.entity';
import { Repository } from 'typeorm';

describe('StatsRepository', () => {
  let repository: StatsRepository;
  let mockStatsRepository: jest.Mocked<Repository<Stats>>;

  beforeEach(() => {
    mockStatsRepository = {} as any;

    repository = new StatsRepository(mockStatsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
