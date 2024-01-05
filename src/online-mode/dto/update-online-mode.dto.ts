import { PartialType } from '@nestjs/mapped-types';
import { CreateOnlineModeDto } from './create-online-mode.dto';

export class UpdateOnlineModeDto extends PartialType(CreateOnlineModeDto) {
  id: number;
}
