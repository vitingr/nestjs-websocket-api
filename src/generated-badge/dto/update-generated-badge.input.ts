import { CreateGeneratedBadgeInput } from './create-generated-badge.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGeneratedBadgeInput extends PartialType(CreateGeneratedBadgeInput) {
  @Field(() => Int)
  id: number;
}
