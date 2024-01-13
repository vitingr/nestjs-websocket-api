import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Badge {
  @Field()
  id: string

  @Field()
  badgeImage: string

  @Field()
  clubname: string

  @Field((type) => Float)
  maxValue: number;

  @Field((type) => Float)
  minValue: number;

  @Field((type) => Float)
  quickSellValue: number;
}
