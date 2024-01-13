import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeResolver } from './badge.resolver';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [BadgeResolver, BadgeService, PrismaService],
})
export class BadgeModule {}
