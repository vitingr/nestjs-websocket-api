import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class ChangeClubBadge {
  @IsAlpha()
  @Field()
  userId: string;
  
  @IsAlpha()
  @Field()
  clubBadge: string;
}
