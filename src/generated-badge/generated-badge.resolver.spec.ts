import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedBadgeResolver } from './generated-badge.resolver';
import { GeneratedBadgeService } from './generated-badge.service';

describe('GeneratedBadgeResolver', () => {
  let resolver: GeneratedBadgeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratedBadgeResolver, GeneratedBadgeService],
    }).compile();

    resolver = module.get<GeneratedBadgeResolver>(GeneratedBadgeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
