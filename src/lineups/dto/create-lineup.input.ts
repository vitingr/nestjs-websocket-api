import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class CreateLineupInput {
  @Field()
  @IsAlpha()
  name: string;

  @Field((type) => Float, { nullable: true })
  overall?: number;

  @Field((type) => Float, { nullable: true })
  totalOverall?: number;

  @Field()
  @IsAlpha()
  owner: string;
}
