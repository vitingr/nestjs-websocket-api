import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGeneratedBadgeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
