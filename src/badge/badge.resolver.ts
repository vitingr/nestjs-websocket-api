import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BadgeService } from './badge.service';
import { Badge } from './entities/badge.entity';
import { CreateBadgeInput } from './dto/create-badge.input';
import { UpdateBadgeInput } from './dto/update-badge.input';

@Resolver((of) => Badge)
export class BadgeResolver {
  constructor(private readonly badgeService: BadgeService) {}

  @Mutation((type) => Badge)
  createBadge(@Args('createBadgeInput') createBadgeInput: CreateBadgeInput): Promise<Badge> {
    return this.badgeService.create(createBadgeInput);
  }

  @Query((type) => [Badge])
  findAll(): Promise<Badge[]> {
    return this.badgeService.findAll();
  }

  @Query((type) => Badge)
  findOne(@Args('id', { type: () => String }) id: string): Promise<Badge> {
    return this.badgeService.findOne(id);
  }
}
