import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class ClubSetupProps {
  @Field()
  @IsAlpha()
  id: string;

  @Field()
  @IsAlpha()
  clubname: string;
}
