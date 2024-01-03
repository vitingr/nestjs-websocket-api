import { Module } from '@nestjs/common';
import { LineupsService } from './lineups.service';
import { LineupsResolver } from './lineups.resolver';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [LineupsResolver, LineupsService, PrismaService],
})
export class LineupsModule {}
