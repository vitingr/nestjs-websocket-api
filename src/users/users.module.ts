import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/database/prisma.service';
import { UsersResolver } from './users.resolver';
import { CardsModule } from 'src/cards/cards.module';

@Module({
  providers: [UsersService, PrismaService, UsersResolver, CardsModule],
  exports: [UsersModule],
})
export class UsersModule {}
