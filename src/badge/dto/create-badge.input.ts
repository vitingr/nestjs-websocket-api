import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class CreateBadgeInput {
  @IsAlpha()
  @Field()
  badgeImage: string;

  @IsAlpha()
  @Field()
  clubname: string;

  @Field((type) => Float)
  maxValue: number;

  @Field((type) => Float)
  minValue: number;

  @Field((type) => Float)
  quickSellValue: number;
}
