import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import { CreateCardInput } from './dto/create-card.input';

@Resolver((of) => Card)
export class CardsResolver {
  constructor(private readonly cardsService: CardsService) {}

  @Mutation((returns) => Card)
  createCard(
    @Args('createCardInput') createUser: CreateCardInput,
  ): Promise<Card> {
    return this.cardsService.createCard(createUser);
  }

  @Query((returns) => [Card])
  findAll(): Promise<Card[]> {
    return this.cardsService.findAll();
  }

  @Query((returns) => Card)
  findOne(@Args('id', { type: () => String }) id: string): Promise<Card> {
    return this.cardsService.findOne(id);
  }
}
