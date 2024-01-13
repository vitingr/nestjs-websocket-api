import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedBadgeService } from './generated-badge.service';

describe('GeneratedBadgeService', () => {
  let service: GeneratedBadgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratedBadgeService],
    }).compile();

    service = module.get<GeneratedBadgeService>(GeneratedBadgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
