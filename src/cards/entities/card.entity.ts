import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Card {
  @Field()
  id: string;

  @Field()
  cardImage: string;

  @Field()
  name: string;

  @Field()
  club: string;

  @Field()
  league: string;

  @Field()
  type: string;

  @Field((type) => Int)
  overall: number;

  @Field((type) => Int)
  pace: number;

  @Field((type) => Int)
  finalization: number;
  
  @Field((type) => Int)
  pass: number;
 
  @Field((type) => Int)
  drible: number;
 
  @Field((type) => Int)
  defense: number;
 
  @Field((type) => Int)
  physic: number;

  @Field((type) => Float)
  minValue: number;

  @Field((type) => Float)
  maxValue: number;

  @Field((type) => Float)
  quickSellValue: number;
}
