import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GeneratedCardsService } from './generated-cards.service';
import { GeneratedCard } from './entities/generated-card.entity';
import { CreateGeneratedCardInput } from './dto/create-generated-card.input';
import { SellCard } from './dto/sell-card';
import { PackResponse } from './entities/pack-response.entity';
import { QuickSellProps } from './dto/quick-sell';
import { User } from 'src/users/entities/user-entity';
import { PickStarterTeamProps } from './dto/pick-starter-team';
import { ClubSetupProps } from './dto/finish-club-setup';
import { OpenPackProps } from './dto/open-pack';

@Resolver((of) => GeneratedCard)
export class GeneratedCardsResolver {
  constructor(private readonly generatedCardsService: GeneratedCardsService) {}

  @Mutation((returns) => GeneratedCard)
  createGeneratedCard(
    @Args('createGeneratedCardInput')
    createGeneratedCardInput: CreateGeneratedCardInput,
  ): Promise<GeneratedCard> {
    return this.generatedCardsService.create(createGeneratedCardInput);
  }

  @Query((returns) => [GeneratedCard])
  findAll(): Promise<GeneratedCard[]> {
    return this.generatedCardsService.findAll();
  }

  @Query((returns) => GeneratedCard)
  findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<GeneratedCard> {
    return this.generatedCardsService.findOne(id);
  }

  @Query((returns) => [GeneratedCard])
  findUserCards(@Args('id', { type: () => String }) id: string) {
    return this.generatedCardsService.findUserCards(id);
  }

  @Query((returns) => [GeneratedCard])
  findSellingCards(): Promise<GeneratedCard[]> {
    return this.generatedCardsService.getSellingCards();
  }

  @Mutation((returns) => GeneratedCard)
  sellCard(@Args('sellCard') sellCard: SellCard) {
    return this.generatedCardsService.sellCard(sellCard);
  }

  @Mutation((returns) => GeneratedCard)
  buyCard(@Args('sellCard') sellCard: SellCard) {
    return this.generatedCardsService.buyCard(sellCard);
  }

  @Mutation((returns) => [PackResponse])
  openPlayersPack(
    @Args('openPack') openPack: OpenPackProps,
  ): Promise<PackResponse[]> {
    return this.generatedCardsService.openPlayersPack(openPack);
  }

  @Mutation((returns) => [PackResponse])
  openRareGoldPack(
    @Args('openPack') openPack: OpenPackProps,
  ): Promise<PackResponse[]> {
    return this.generatedCardsService.openRareGoldPack(openPack);
  }

  @Mutation((returns) => [PackResponse])
  openGoldPack(
    @Args('openPack') openPack: OpenPackProps,
  ): Promise<PackResponse[]> {
    return this.generatedCardsService.openGoldPack(openPack);
  }

  @Mutation((returns) => [PackResponse])
  openRareSilverPack(
    @Args('openPack') openPack: OpenPackProps,
  ): Promise<PackResponse[]> {
    return this.generatedCardsService.openRareSilverPack(openPack);
  }

  @Mutation((returns) => [PackResponse])
  openSilverPack(
    @Args('openPack') openPack: OpenPackProps,
  ): Promise<PackResponse[]> {
    return this.generatedCardsService.openSilverPack(openPack);
  }

  @Mutation((returns) => [PackResponse])
  openBronzePack(
    @Args('openPack') openPack: OpenPackProps,
  ): Promise<PackResponse[]> {
    return this.generatedCardsService.openBronzePack(openPack);
  }

  @Mutation((returns) => User)
  quickSellCard(
    @Args('quickSellCard') quickSellCard: QuickSellProps,
  ): Promise<User> {
    return this.generatedCardsService.quickSellCard(quickSellCard);
  }

  @Mutation((returns) => [GeneratedCard])
  pickStarterTeam(@Args('pickStarterTeam') pickStarterTeam: PickStarterTeamProps): Promise<GeneratedCard[]> {
    return this.generatedCardsService.pickStarterTeam(pickStarterTeam)
  }

  @Mutation((returns) => User)
  finishClubSetup(@Args('clubSetup') clubSetup: ClubSetupProps): Promise<User> {
    return this.generatedCardsService.finishClubSetup(clubSetup)
  }
}
