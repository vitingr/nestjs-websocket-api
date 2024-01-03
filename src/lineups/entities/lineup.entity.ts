import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

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
  player1: string;

  @Field({nullable: true})
  player2: string;

  @Field({nullable: true})
  player3: string;

  @Field({nullable: true})
  player4: string;

  @Field({nullable: true})
  player5: string;

  @Field({nullable: true})
  player6: string;

  @Field({nullable: true})
  player7: string;

  @Field({nullable: true})
  player8: string;

  @Field({nullable: true})
  player9: string;

  @Field({nullable: true})
  player10: string;

  @Field({nullable: true})
  player11: string;
}
