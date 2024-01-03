import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedCardsService } from './generated-cards.service';

describe('GeneratedCardsService', () => {
  let service: GeneratedCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratedCardsService],
    }).compile();

    service = module.get<GeneratedCardsService>(GeneratedCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
