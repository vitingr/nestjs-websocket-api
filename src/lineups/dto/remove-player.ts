import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class RemoveLineupPlayer {
  @Field()
  @IsAlpha()
  lineupId: string;

  @Field()
  @IsAlpha()
  position: string;
}
