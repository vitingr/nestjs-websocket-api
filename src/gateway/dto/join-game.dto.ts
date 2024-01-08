import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';
import { Socket } from 'socket.io';

@InputType()
export class JoinGameDto {
  @Field()
  @IsAlpha()
  username: string;

  @Field()
  @IsAlpha()
  matchId: string;
}
