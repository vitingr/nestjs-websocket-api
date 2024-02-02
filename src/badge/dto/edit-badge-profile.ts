import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class EditBadgeProfile {
  @Field()
  @IsAlpha()
  ownerId: string;

  @Field()
  @IsAlpha()
  newOwnerId: string;

  @Field()
  @IsAlpha()
  badgeId: string;

  @Field((type) => Float)
  price: number;
}
