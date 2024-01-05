import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { IsAlpha } from 'class-validator';

@InputType()
class PlayerDataInput {
  @Field()
  cardImage: string;
  
  @Field()
  owner: string;

  @Field((type) => Boolean)
  selling: boolean;

  @Field((type) => Date, {nullable: true})
  created?: Date;

  @Field((type) => Float, {nullable: true})
  price?: number;

  @Field()
  playerId: string;

  @Field()
  name: string;

  @Field()
  club: string;

  @Field()
  league: string;

  @Field()
  type: string;

  @Field()
  position: string;

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

@InputType()
export class UpdateLineupCard {
  @Field()
  @IsAlpha()
  lineupId: string;

  @Field()
  @IsAlpha()
  playerId: string;

  @Field()
  playerData: string;

  @Field((type) => Int)
  index: number;
}
