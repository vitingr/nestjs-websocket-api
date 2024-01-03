import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class CreateUser {
  @IsAlpha()
  @Field()
  uuid: string;
  
  @IsAlpha()
  @Field()
  name: string;

  @IsAlpha()
  @Field()
  firstname: string;

  @IsAlpha()
  @Field()
  lastname: string;

  @IsAlpha()
  @Field()
  clubname: string;

  @IsAlpha()
  @Field()
  email: string;

  @IsAlpha()
  @Field({nullable: true})
  password: string;
}
