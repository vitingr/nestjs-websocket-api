import { Module } from '@nestjs/common';
import { MyGateway } from './gateway.gateway';
import { GatewayService } from './gateway.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [MyGateway, GatewayService, PrismaService],
})
export class GatewayModule {}
