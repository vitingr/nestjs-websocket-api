import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LineupsService } from './lineups.service';
import { Lineup } from './entities/lineup.entity';
import { CreateLineupInput } from './dto/create-lineup.input';
import { UpdateLineupCard } from './dto/update-lineup-card';

@Resolver((of) => Lineup)
export class LineupsResolver {
  constructor(private readonly lineupsService: LineupsService) {}

  @Mutation(() => Lineup)
  createLineup(
    @Args('createLineupInput') createLineupInput: CreateLineupInput,
  ): Promise<Lineup> {
    return this.lineupsService.create(createLineupInput);
  }

  @Query(() => [Lineup])
  findAll(): Promise<Lineup[]> {
    return this.lineupsService.findAll();
  }

  @Query(() => Lineup)
  findLineup(@Args('id', { type: () => String }) id: string): Promise<Lineup> {
    return this.lineupsService.findOne(id);
  }

  @Query((returns) => [Lineup])
  getUserLineups(@Args('id', { type: () => String }) id: string): Promise<Lineup[]> {
    return this.lineupsService.getUserLineups(id);
  }

  @Mutation((returns) => Lineup)
  deleteUserLineup(@Args('id', {type: () => String}) id: string): Promise<Lineup> {
    return this.lineupsService.deleteUserLineup(id)
  }

  @Mutation((returns) => Lineup)
  updateLineupCard(@Args('updateLineupCard') updateLineupCard: UpdateLineupCard): Promise<Lineup> {
    return this.lineupsService.updateLineupCard(updateLineupCard)
  }
}
