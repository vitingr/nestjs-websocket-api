import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class Challenge2Props {
  @IsAlpha()
  @Field()
  userId: string;
  
  @IsAlpha()
  @Field()
  player1: string;

  @IsAlpha()
  @Field()
  player2: string;

  @IsAlpha()
  @Field()
  player3: string;
}
