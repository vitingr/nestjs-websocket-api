import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class CreateCardInput {
  @IsAlpha()
  @Field()
  cardImage: string;

  @IsAlpha()
  @Field()
  name: string;

  @IsAlpha()
  @Field()
  club: string;

  @IsAlpha()
  @Field()
  league: string;

  @IsAlpha()
  @Field()
  type: string;

  @Field()
  @IsAlpha()
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
