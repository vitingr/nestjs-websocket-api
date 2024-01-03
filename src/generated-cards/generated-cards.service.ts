import { Injectable } from '@nestjs/common';
import { CreateGeneratedCardInput } from './dto/create-generated-card.input';
import { UpdateGeneratedCardInput } from './dto/update-generated-card.input';
import { GeneratedCard } from './entities/generated-card.entity';
import { PrismaService } from 'src/database/prisma.service';
import { Card } from 'src/cards/entities/card.entity';
import { SellCard } from './dto/sell-card';

@Injectable()
export class GeneratedCardsService {

  constructor(private prisma: PrismaService) {}

  create(data: CreateGeneratedCardInput): Promise<GeneratedCard> {
    const createdCard = this.prisma.playerCardGenerated.create({
      data: data
    })
    return createdCard
  }

  findAll(): Promise<GeneratedCard[]> {
    return this.prisma.playerCardGenerated.findMany()
  }

  findOne(id: string): Promise<GeneratedCard> {
    return this.prisma.playerCardGenerated.findUnique({
      where: {
        id: id
      }
    })
  }

  findUserCards(id: string): Promise<GeneratedCard[]> {
    return this.prisma.playerCardGenerated.findMany({
      where: {
        owner: id,
        selling: false
      },
      orderBy: {
        overall: 'asc'
      }
    })
  }

  getSellingCards(): Promise<GeneratedCard[]> {
    return this.prisma.playerCardGenerated.findMany({
      where: {
        selling: true
      }
    })
  }

  sellCard(data: SellCard): Promise<GeneratedCard> {
    return this.prisma.playerCardGenerated.update({
      where: {
        id: data.playerId
      },
      data: {
        selling: true,
        price: data.price
      }
    })
  }

  async buyCard(data: SellCard): Promise<GeneratedCard> {

    const updateOwner = await this.prisma.user.update({
      where: {
        id: data.ownerId
      },
      data: {
        currency: {increment: data.price}
      }
    })

    const updateUser = await this.prisma.user.update({
      where: {
        id: data.newOwnerId
      },
      data: {
        currency: {decrement: data.price}
      }
    })

    const updatedCard = await this.prisma.playerCardGenerated.update({
      where: {
        id: data.playerId
      },
      data: {
        selling: false,
        owner: data.newOwnerId,

      }
    })

    return updatedCard
  }

  async openPlayersPack(userId: string): Promise<any> {
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        currency: {decrement: 1}
      }
    })

    const CardsDrop = await this.prisma.playerCard.findMany({
      take: 1,
      skip: Math.floor(Math.random() * await this.prisma.playerCard.count()),
      where: {
        overall: {
          in: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85]
        }
      }
    })

    const cardsToCreate = await CardsDrop.map((card: Card, index: number) => ({
      cardImage: card.cardImage,
      owner: userId,
      selling: false,
      playerId: card.id,
      name: card.name,
      club: card.club,
      league: card.league,
      type: card.type,
      overall: card.overall,
      pace: card.pace,
      finalization: card.finalization,
      pass: card.pass,
      drible: card.drible,
      defense: card.defense,
      physic: card.physic,
      minValue: card.minValue,
      maxValue: card.maxValue,
      quickSellValue: card.quickSellValue
    }))

    const generatedCards = await this.prisma.playerCardGenerated.createMany({
      data: cardsToCreate
    })

    return cardsToCreate
  }
}
