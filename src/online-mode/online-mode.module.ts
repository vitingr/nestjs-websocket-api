import { Module } from '@nestjs/common';
import { OnlineModeService } from './online-mode.service';
import { OnlineModeGateway } from './online-mode.gateway';

@Module({
  providers: [OnlineModeGateway, OnlineModeService],
})
export class OnlineModeModule {}
