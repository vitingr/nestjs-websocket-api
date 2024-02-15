import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LineupsService } from './lineups.service';
import { Lineup } from './entities/lineup.entity';
import { CreateLineupInput } from './dto/create-lineup.input';
import { UpdateLineupCard } from './dto/update-lineup-card';
import { SelectLineup } from './dto/select-lineup';
import { User } from 'src/users/entities/user-entity';
import { RemoveLineupPlayer } from './dto/remove-player';
import { DeleteUserLineupProps } from './dto/delete-lineup';

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
  getUserLineups(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Lineup[]> {
    return this.lineupsService.getUserLineups(id);
  }

  @Mutation((returns) => Lineup)
  deleteUserLineup(
    @Args('deleteUserLineup') deleteUserLineup: DeleteUserLineupProps,
  ): Promise<Lineup> {
    console.log(deleteUserLineup)
    return this.lineupsService.deleteUserLineup(deleteUserLineup);
  }

  @Mutation((returns) => Lineup)
  updateLineupCard(
    @Args('updateLineupCard') updateLineupCard: UpdateLineupCard,
  ): Promise<Lineup> {
    return this.lineupsService.updateLineupCard(updateLineupCard);
  }

  @Mutation((returns) => User)
  selectLineup(
    @Args('selectLineup') selectLineup: SelectLineup,
  ): Promise<User> {
    return this.lineupsService.selectLineup(selectLineup);
  }

  @Query((returns) => Lineup)
  findUserCurrentLineup(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Lineup> {
    return this.lineupsService.findUserCurrentLineup(id);
  }

  @Mutation((returns) => Lineup)
  removeLineupPlayer(
    @Args('removeLineupPlayer') removeLineupPlayer: RemoveLineupPlayer,
  ): Promise<Lineup> {
    return this.lineupsService.removeLineupPlayer(removeLineupPlayer);
  }
}
