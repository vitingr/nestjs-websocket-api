import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class DeleteUserLineupProps {
  @Field()
  @IsAlpha()
  lineupId: string;

  @Field()
  @IsAlpha()
  userId: string;
}
