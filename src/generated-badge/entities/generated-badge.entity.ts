import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class GeneratedBadge {
  @Field()
  id: string;

  @Field()
  badgeId: string;

  @Field()
  ownerId: string;

  @Field()
  selling: boolean;

  @Field()
  created: Date;

  @Field((type) => Float)
  price: number;

  @Field()
  badgeImage: string;

  @Field()
  clubname: string;

  @Field((type) => Float)
  maxValue: number;

  @Field((type) => Float)
  minValue: number;

  @Field((type) => Float)
  quickSellValue: number;
}
