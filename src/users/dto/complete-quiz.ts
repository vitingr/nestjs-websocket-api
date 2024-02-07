import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class CompleteQuizProps {
  @IsAlpha()
  @Field()
  userId: string;
  
  @Field()
  @IsAlpha()
  quiz: string;

  @Field()
  prize: number;
}
