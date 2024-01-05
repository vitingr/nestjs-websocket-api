import { Test, TestingModule } from '@nestjs/testing';
import { OnlineModeService } from './online-mode.service';

describe('OnlineModeService', () => {
  let service: OnlineModeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineModeService],
    }).compile();

    service = module.get<OnlineModeService>(OnlineModeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
