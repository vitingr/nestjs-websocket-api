import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaService } from './database/prisma.service';
import { CardsModule } from './cards/cards.module';
import { GatewayModule } from './gateway/gateway.module';
import { LineupsModule } from './lineups/lineups.module';
import { GeneratedCardsModule } from './generated-cards/generated-cards.module';
import { BadgeModule } from './badge/badge.module';
import { GeneratedBadgeModule } from './generated-badge/generated-badge.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      csrfPrevention: false,
    }),
    UsersModule,
    CardsModule,
    GatewayModule,
    LineupsModule,
    GeneratedCardsModule,
    BadgeModule,
    GeneratedBadgeModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
