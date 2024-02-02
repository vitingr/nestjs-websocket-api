import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GeneratedBadgeService } from './generated-badge.service';
import { GeneratedBadge } from './entities/generated-badge.entity';
import { CreateGeneratedBadgeInput } from './dto/create-generated-badge.input';
import { UpdateGeneratedBadgeInput } from './dto/update-generated-badge.input';

@Resolver(() => GeneratedBadge)
export class GeneratedBadgeResolver {
  constructor(private readonly generatedBadgeService: GeneratedBadgeService) {}

  @Mutation((returns) => GeneratedBadge)
  createGeneratedBadge(@Args('createGeneratedBadgeInput') createGeneratedBadgeInput: CreateGeneratedBadgeInput) {
    return this.generatedBadgeService.create(createGeneratedBadgeInput);
  }

  @Query((returns) => [GeneratedBadge], { name: 'generatedBadge' })
  findAll() {
    return this.generatedBadgeService.findAll();
  }

  @Query((returns) => GeneratedBadge, { name: 'generatedBadge' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.generatedBadgeService.findOne(id);
  }

  @Mutation((returns) => GeneratedBadge)
  updateGeneratedBadge(@Args('updateGeneratedBadgeInput') updateGeneratedBadgeInput: UpdateGeneratedBadgeInput) {
    return this.generatedBadgeService.update(updateGeneratedBadgeInput.id, updateGeneratedBadgeInput);
  }

  @Mutation((returns) => GeneratedBadge)
  removeGeneratedBadge(@Args('id', { type: () => Int }) id: number) {
    return this.generatedBadgeService.remove(id);
  }
}
