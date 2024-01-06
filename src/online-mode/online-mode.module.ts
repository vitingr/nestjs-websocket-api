import { Module } from '@nestjs/common';
import { OnlineModeService } from './online-mode.service';
import { OnlineModeGateway } from './online-mode.gateway';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [OnlineModeGateway, OnlineModeService, PrismaService],
})
export class OnlineModeModule {}
