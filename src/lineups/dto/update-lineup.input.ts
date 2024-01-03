import { CreateLineupInput } from './create-lineup.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLineupInput extends PartialType(CreateLineupInput) {
  @Field(() => Int)
  id: number;
}
