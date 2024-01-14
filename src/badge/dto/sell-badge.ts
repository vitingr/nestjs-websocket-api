import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class SellBadge {
  @IsAlpha()
  @Field()
  id: string;

  @Field((type) => Float)
  price: number;

}
