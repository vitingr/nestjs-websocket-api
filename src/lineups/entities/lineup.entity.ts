import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
class PlayerData {
  @Field()
  id: string;

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

@ObjectType()
export class Lineup {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field((type) => Float, {nullable: true})
  overall?: number;

  @Field((type) => Float, {nullable: true})
  totalOverall?: number;

  @Field()
  owner: string;

  @Field({nullable: true})
  player1: string

  @Field({nullable: true})
  player2: string

  @Field({nullable: true})
  player3: string

  @Field({nullable: true})
  player4: string

  @Field({nullable: true})
  player5: string

  @Field({nullable: true})
  player6: string

  @Field({nullable: true})
  player7: string

  @Field({nullable: true})
  player8: string

  @Field({nullable: true})
  player9: string

  @Field({nullable: true})
  player10:string;

  @Field({nullable: true})
  player11:string;
}
