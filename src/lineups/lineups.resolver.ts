import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LineupsService } from './lineups.service';
import { Lineup } from './entities/lineup.entity';
import { CreateLineupInput } from './dto/create-lineup.input';
import { UpdateLineupInput } from './dto/update-lineup.input';

@Resolver((of) => Lineup)
export class LineupsResolver {
  constructor(private readonly lineupsService: LineupsService) {}

  @Mutation(() => Lineup)
  createLineup(
    @Args('createLineupInput') createLineupInput: CreateLineupInput,
  ) {
    return this.lineupsService.create(createLineupInput);
  }

  @Query(() => [Lineup])
  findAll() {
    return this.lineupsService.findAll();
  }

  @Query(() => Lineup)
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.lineupsService.findOne(id);
  }

  @Query((returns) => [Lineup])
  getUserLineups(@Args('id', { type: () => String }) id: string) {
    return this.lineupsService.getUserLineups(id);
  }
}
