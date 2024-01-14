import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  clubname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field((type) => Float)
  currency: number;

  @Field((type) => Int, { nullable: true })
  qtdCards: number;

  @Field({ nullable: true })
  badge: string;

  @Field((type) => [String])
  friends: string[];

  @Field((type) => Int, { nullable: true })
  qtdFriends: number;

  @Field((type) => [String], { nullable: true })
  pendingFriends: string[];

  @Field((type) => [String], { nullable: true })
  lineups: string[];

  @Field()
  driverMenu: boolean;

  @Field()
  driverHome: boolean;

  @Field()
  driverLineup: boolean;

  @Field()
  driverProfile: boolean;

  @Field()
  newUser: boolean;

  @Field((type) => Int, { nullable: true })
  futpoints: number;

  @Field((type) => Int, { nullable: true })
  points: number;

  @Field((type) => Int, { nullable: true })
  victories: number;

  @Field((type) => Int, { nullable: true })
  draws: number;

  @Field((type) => Int, { nullable: true })
  loses: number;

  @Field((type) => Boolean, { nullable: true })
  searchingMatch: boolean;

  @Field({nullable: true})
  currentLineup: string;
}
