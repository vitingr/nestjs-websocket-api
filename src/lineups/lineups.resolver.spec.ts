import { Test, TestingModule } from '@nestjs/testing';
import { LineupsResolver } from './lineups.resolver';
import { LineupsService } from './lineups.service';

describe('LineupsResolver', () => {
  let resolver: LineupsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineupsResolver, LineupsService],
    }).compile();

    resolver = module.get<LineupsResolver>(LineupsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
