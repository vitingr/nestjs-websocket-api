import { Test, TestingModule } from '@nestjs/testing';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';

describe('CardsResolver', () => {
  let resolver: CardsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsResolver, CardsService],
    }).compile();

    resolver = module.get<CardsResolver>(CardsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
