import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LineupsService } from './lineups.service';
import { Lineup } from './entities/lineup.entity';
import { CreateLineupInput } from './dto/create-lineup.input';
import { UpdateLineupInput } from './dto/update-lineup.input';

@Resolver(() => Lineup)
export class LineupsResolver {
  constructor(private readonly lineupsService: LineupsService) {}

  @Mutation(() => Lineup)
  createLineup(@Args('createLineupInput') createLineupInput: CreateLineupInput) {
    return this.lineupsService.create(createLineupInput);
  }

  @Query(() => [Lineup], { name: 'lineups' })
  findAll() {
    return this.lineupsService.findAll();
  }

  @Query(() => Lineup, { name: 'lineup' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.lineupsService.findOne(id);
  }

  @Mutation(() => Lineup)
  updateLineup(@Args('updateLineupInput') updateLineupInput: UpdateLineupInput) {
    return this.lineupsService.update(updateLineupInput.id, updateLineupInput);
  }

  @Mutation(() => Lineup)
  removeLineup(@Args('id', { type: () => Int }) id: number) {
    return this.lineupsService.remove(id);
  }
}
