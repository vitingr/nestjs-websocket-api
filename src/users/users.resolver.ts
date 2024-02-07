import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entities/user-entity';
import { UsersService } from './users.service';
import { CreateUser } from './dto/create-user';
import { SendFriendInvite } from './dto/send-invite';
import { ChangeClubName } from './dto/change-club-name';
import { ChangeClubBadge } from './dto/change-club-badge';
import { CompleteQuizProps } from './dto/complete-quiz';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query((returns) => User)
  getUser(@Args('uuid', { type: () => String }) uuid: string): Promise<User> {
    return this.userService.findOne(uuid);
  }

  @Query((returns) => [User])
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation((returns) => User)
  createNewUser(@Args('createUser') createUser: CreateUser): Promise<User> {
    return this.userService.createUser(createUser);
  }

  @Query((returns) => [User])
  getUserFriends(
    @Args('friends', { type: () => [String] }) friends: string[],
  ): Promise<User[]> {
    return this.userService.getUserFriends(friends);
  }

  @Query((returns) => [User])
  getUserPendingFriends(
    @Args('playersId', { type: () => [String] }) playersId: string[],
  ): Promise<User[]> {
    return this.userService.getUserPendingFriends(playersId);
  }

  @Mutation((returns) => User)
  changeClubName(
    @Args('changeClubName') changeClubName: ChangeClubName,
  ): Promise<User> {
    return this.userService.changeClubName(changeClubName);
  }

  @Mutation((returns) => User)
  useMenuDriver(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.useMenuDriver(id);
  }

  @Mutation((returns) => User)
  useHomeDriver(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.useHomeDriver(id);
  }

  @Mutation((returns) => User)
  useLineupDriver(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return this.userService.useLineupDriver(id);
  }

  @Mutation((returns) => User)
  useProfileDriver(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return this.userService.useProfileDriver(id);
  }

  @Query((returns) => User)
  findOneUser(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.findOneUser(id);
  }

  @Mutation((returns) => User)
  changeClubBadge(
    @Args('changeClubBadge') changeClubBadge: ChangeClubBadge,
  ): Promise<User> {
    return this.userService.changeClubBadge(changeClubBadge);
  }

  @Mutation((returns) => User)
  completeQuiz(
    @Args('completeQuiz') completeQuiz: CompleteQuizProps,
  ): Promise<User> {
    return this.userService.completeQuiz(completeQuiz);
  }
}
