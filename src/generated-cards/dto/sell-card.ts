import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';


@InputType()
export class SellCard {
  @Field()
  @IsAlpha()
  ownerId: string;

  @Field()
  @IsAlpha()
  newOwnerId: string;

  @Field()
  @IsAlpha()
  playerId: string;

  @Field((type) => Float)
  price: number;
}
