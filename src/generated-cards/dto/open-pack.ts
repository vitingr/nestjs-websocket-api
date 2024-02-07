import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class OpenPackProps {
  @Field()
  @IsAlpha()
  userId: string;

  @Field()
  @IsAlpha()
  method: string;
}
