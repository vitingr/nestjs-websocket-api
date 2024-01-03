import { CreateGeneratedCardInput } from './create-generated-card.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGeneratedCardInput extends PartialType(CreateGeneratedCardInput) {
  @Field(() => Int)
  id: number;
}
