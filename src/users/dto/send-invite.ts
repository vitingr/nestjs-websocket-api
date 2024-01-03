import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class SendFriendInvite {
  @IsAlpha()
  @Field()
  userId: string;
  
  @IsAlpha()
  @Field()
  friendId: string;

  @Field({nullable: true})
  socketId?: string;
}
