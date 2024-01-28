import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class QuickSellProps {
  @Field()
  @IsAlpha()
  ownerId: string;

  @Field()
  @IsAlpha()
  cardId: string;

  @Field((type) => Float)
  price: number;
}
