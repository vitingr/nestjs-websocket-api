
import { PartialType } from '@nestjs/mapped-types';

export class AcceptMatchModeDto {
  userId: string;
  matchId: string;
  cancel?: boolean;
}