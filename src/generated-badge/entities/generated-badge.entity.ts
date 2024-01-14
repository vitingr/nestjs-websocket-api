import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class GeneratedBadge {
  @Field()
  id: string;

  @Field()
  badgeId: string;

  @Field()
  ownerId: string;

  @Field((type) => Boolean)
  selling: boolean;

  @Field((type) => Date)
  created: Date;

  @Field((type) => Float, { nullable: true })
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
