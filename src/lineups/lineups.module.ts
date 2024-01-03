import { Module } from '@nestjs/common';
import { LineupsService } from './lineups.service';
import { LineupsResolver } from './lineups.resolver';

@Module({
  providers: [LineupsResolver, LineupsService],
})
export class LineupsModule {}
