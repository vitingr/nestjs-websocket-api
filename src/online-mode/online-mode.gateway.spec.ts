import { Test, TestingModule } from '@nestjs/testing';
import { OnlineModeGateway } from './online-mode.gateway';
import { OnlineModeService } from './online-mode.service';

describe('OnlineModeGateway', () => {
  let gateway: OnlineModeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineModeGateway, OnlineModeService],
    }).compile();

    gateway = module.get<OnlineModeGateway>(OnlineModeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
