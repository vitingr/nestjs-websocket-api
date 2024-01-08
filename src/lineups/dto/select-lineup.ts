import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class SelectLineup {
  @Field()
  @IsAlpha()
  userId: string;

  @Field()
  @IsAlpha()
  lineupId: string;
}
