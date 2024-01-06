import { PartialType } from '@nestjs/mapped-types';
import { CreateOnlineModeDto } from './create-online-mode.dto';

export class AcceptMatchModeDto extends PartialType(CreateOnlineModeDto) {
  userId: string;
  matchId: string;
  cancel?: boolean;
}
