import { Module } from '@nestjs/common';
import { GeneratedCardsService } from './generated-cards.service';
import { GeneratedCardsResolver } from './generated-cards.resolver';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [GeneratedCardsResolver, GeneratedCardsService, PrismaService],
})
export class GeneratedCardsModule {}
