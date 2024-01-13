import { CreateBadgeInput } from './create-badge.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBadgeInput extends PartialType(CreateBadgeInput) {
  @Field(() => Int)
  id: number;
}
