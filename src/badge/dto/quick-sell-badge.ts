import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class QuickSellBadgeProps {
  @IsAlpha()
  @Field()
  badgeId: string;

  @IsAlpha()
  @Field()
  ownerId: string;

  @Field((type) => Float)
  price: number;

}
