import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GeneratedCardsService } from './generated-cards.service';
import { GeneratedCard } from './entities/generated-card.entity';
import { CreateGeneratedCardInput } from './dto/create-generated-card.input';
import { UpdateGeneratedCardInput } from './dto/update-generated-card.input';
import { SellCard } from './dto/sell-card';
import { GeneratedBadge } from 'src/generated-badge/entities/generated-badge.entity';
import { PackResponse } from './entities/pack-response.entity';
import { QuickSellProps } from './dto/quick-sell';
import { User } from 'src/users/entities/user-entity';

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
    @Args('id', { type: () => String }) id: string,
  ): Promise<[GeneratedCard[], GeneratedBadge[]]> {
    return this.generatedCardsService.openPlayersPack(id);
  }

  @Mutation((returns) => [PackResponse])
  openRareGoldPack(
    @Args('id', { type: () => String }) id: string,
  ): Promise<[GeneratedCard[], GeneratedBadge[]]> {
    return this.generatedCardsService.openRareGoldPack(id);
  }

  @Mutation((returns) => [PackResponse])
  openGoldPack(
    @Args('id', { type: () => String }) id: string,
  ): Promise<[GeneratedCard[], GeneratedBadge[]]> {
    return this.generatedCardsService.openGoldPack(id);
  }

  @Mutation((returns) => [PackResponse])
  openRareSilverPack(
    @Args('id', { type: () => String }) id: string,
  ): Promise<[GeneratedCard[], GeneratedBadge[]]> {
    return this.generatedCardsService.openRareSilverPack(id);
  }

  @Mutation((returns) => [PackResponse])
  openSilverPack(
    @Args('id', { type: () => String }) id: string,
  ): Promise<[GeneratedCard[], GeneratedBadge[]]> {
    return this.generatedCardsService.openSilverPack(id);
  }

  @Mutation((returns) => [PackResponse])
  openBronzePack(
    @Args('id', { type: () => String }) id: string,
  ): Promise<[GeneratedCard[], GeneratedBadge[]]> {
    return this.generatedCardsService.openBronzePack(id);
  }

  @Mutation((returns) => User)
  quickSellCard(
    @Args('quickSellCard') quickSellCard: QuickSellProps,
  ): Promise<User> {
    return this.generatedCardsService.quickSellCard(quickSellCard);
  }
}
