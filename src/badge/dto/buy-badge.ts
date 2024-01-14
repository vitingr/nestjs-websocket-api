import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class BuyBadge {
  @IsAlpha()
  @Field()
  id: string;

  @IsAlpha()
  @Field()
  ownerId: string;

  @IsAlpha()
  @Field()
  newOwnerId: string;

  @Field((type) => Float)
  price: number;

}
