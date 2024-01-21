import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { GeneratedCard } from './generated-card.entity';
import { GeneratedBadge } from 'src/generated-badge/entities/generated-badge.entity';

@ObjectType()
export class PackResponse {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  cardImage: string;

  @Field({ nullable: true })
  owner: string;

  @Field((type) => Boolean, { nullable: true })
  selling: boolean;

  @Field((type) => Date, { nullable: true })
  created?: Date;

  @Field((type) => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  playerId: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  club: string;

  @Field({ nullable: true })
  league: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  position: string;

  @Field((type) => Int, { nullable: true })
  overall: number;

  @Field((type) => Int, { nullable: true })
  pace: number;

  @Field((type) => Int, { nullable: true })
  finalization: number;

  @Field((type) => Int, { nullable: true })
  pass: number;

  @Field((type) => Int, { nullable: true })
  drible: number;

  @Field((type) => Int, { nullable: true })
  defense: number;

  @Field((type) => Int, { nullable: true })
  physic: number;

  @Field((type) => Float, { nullable: true })
  minValue: number;

  @Field((type) => Float, { nullable: true })
  maxValue: number;

  @Field((type) => Float, { nullable: true })
  quickSellValue: number;

  @Field({ nullable: true })
  badgeId: string;

  @Field({ nullable: true })
  ownerId: string;

  @Field({ nullable: true })
  badgeImage: string;

  @Field({ nullable: true })
  clubname: string;
  
  @Field((type) => [GeneratedCard], {nullable: true})
  GeneratedCard: GeneratedCard[]

  @Field((type) => [GeneratedBadge], {nullable: true})
  GeneratedBadge: GeneratedBadge[]
}
