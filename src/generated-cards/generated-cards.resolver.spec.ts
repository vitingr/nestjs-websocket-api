import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedCardsResolver } from './generated-cards.resolver';
import { GeneratedCardsService } from './generated-cards.service';

describe('GeneratedCardsResolver', () => {
  let resolver: GeneratedCardsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratedCardsResolver, GeneratedCardsService],
    }).compile();

    resolver = module.get<GeneratedCardsResolver>(GeneratedCardsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
