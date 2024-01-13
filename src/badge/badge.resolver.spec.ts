import { Test, TestingModule } from '@nestjs/testing';
import { BadgeResolver } from './badge.resolver';
import { BadgeService } from './badge.service';

describe('BadgeResolver', () => {
  let resolver: BadgeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeResolver, BadgeService],
    }).compile();

    resolver = module.get<BadgeResolver>(BadgeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
