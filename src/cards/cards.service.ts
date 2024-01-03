import { Injectable } from '@nestjs/common';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { PrismaService } from 'src/database/prisma.service';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {

  constructor(private prisma: PrismaService) {}

  createCard(createUser: CreateCardInput): Promise<Card> {
    const newUser = this.prisma.playerCard.create({
      data: createUser
    })
    return newUser
  }

  findAll(): Promise<Card[]> {
    return this.prisma.playerCard.findMany()
  }

  findOne(id: string): Promise<Card> {
    return this.prisma.playerCard.findUnique({
      where: {
        id: id
      }
    })
  }
}
