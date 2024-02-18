import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BadgeService } from './badge.service';
import { Badge } from './entities/badge.entity';
import { CreateBadgeInput } from './dto/create-badge.input';
import { GeneratedBadge } from 'src/generated-badge/entities/generated-badge.entity';
import { SellBadge } from './dto/sell-badge';
import { BuyBadge } from './dto/buy-badge';
import { QuickSellBadgeProps } from './dto/quick-sell-badge';

@Resolver((of) => Badge)
export class BadgeResolver {
  constructor(private readonly badgeService: BadgeService) {}

  @Mutation((returns) => Badge)
  createBadge(
    @Args('createBadgeInput') createBadgeInput: CreateBadgeInput,
  ): Promise<Badge> {
    return this.badgeService.create(createBadgeInput);
  }

  @Query((returns) => [GeneratedBadge])
  findAll(): Promise<Badge[]> {
    return this.badgeService.findAll();
  }

  @Query((returns) => GeneratedBadge)
  findUserBadge(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Badge> {
    return this.badgeService.findOne(id);
  }
 
  @Query((returns) => [GeneratedBadge])
  findUserBadges(
    @Args('id', { type: () => String }) id: string,
  ): Promise<GeneratedBadge[]> {
    return this.badgeService.findUserBadges(id);
  }

  @Mutation((returns) => GeneratedBadge)
  sellBadge(@Args('sellBadge') sellBadge: SellBadge): Promise<GeneratedBadge> {
    return this.badgeService.sellBadge(sellBadge);
  }

  @Mutation((returns) => GeneratedBadge)
  buyBadge(@Args('buyBadge') buyBadge: BuyBadge): Promise<GeneratedBadge> {
    return this.badgeService.buyBadge(buyBadge);
  }

  @Query((returns) => [GeneratedBadge])
  findSellingBadges(): Promise<GeneratedBadge[]> {
    return this.badgeService.findSellingBadges();
  }

  @Mutation((returns) => GeneratedBadge)
  quickSellBadge(@Args('quickSellBadge') quickSellBadge: QuickSellBadgeProps): Promise<GeneratedBadge> {
    return this.badgeService.quickSellBadge(quickSellBadge)
  }
}
