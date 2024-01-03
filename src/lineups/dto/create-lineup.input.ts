import { Field, Float, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class CreateLineupInput {
  @Field()
  @IsAlpha()
  name: string;

  @Field((type) => Float, { nullable: true })
  overall?: number;

  @Field((type) => Float, { nullable: true })
  totalOverall?: number;

  @Field()
  @IsAlpha()
  owner: string;

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player1: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player2: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player3: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player4: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player5: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player6: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player7: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player8: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player9: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player10: string[];

  @Field((type) => [String], { nullable: true })
  @IsAlpha()
  player11: string[];
}
