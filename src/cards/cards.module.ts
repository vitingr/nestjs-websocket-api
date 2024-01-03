import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsResolver } from './cards.resolver';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [CardsResolver, CardsService, PrismaService],
  exports: [CardsService]
})
export class CardsModule {}
