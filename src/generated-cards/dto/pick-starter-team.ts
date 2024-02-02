import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class PickStarterTeamProps {
  @Field()
  @IsAlpha()
  userId: string;

  @Field()
  @IsAlpha()
  type: string;
}
