import { Module } from '@nestjs/common';
import { GeneratedBadgeService } from './generated-badge.service';
import { GeneratedBadgeResolver } from './generated-badge.resolver';

@Module({
  providers: [GeneratedBadgeResolver, GeneratedBadgeService],
})
export class GeneratedBadgeModule {}
