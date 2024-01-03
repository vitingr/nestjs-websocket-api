import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class ChangeClubName {
  @IsAlpha()
  @Field()
  userId: string;
  
  @IsAlpha()
  @Field()
  clubname: string;
}
