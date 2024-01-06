import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class SearchMatch {
  @Field()
  @IsAlpha()
  id: string;
}
