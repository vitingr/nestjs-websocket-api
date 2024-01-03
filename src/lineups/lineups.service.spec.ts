import { Test, TestingModule } from '@nestjs/testing';
import { LineupsService } from './lineups.service';

describe('LineupsService', () => {
  let service: LineupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineupsService],
    }).compile();

    service = module.get<LineupsService>(LineupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
