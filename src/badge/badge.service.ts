import { Injectable } from '@nestjs/common';
import { CreateBadgeInput } from './dto/create-badge.input';
import { UpdateBadgeInput } from './dto/update-badge.input';
import { PrismaService } from 'src/database/prisma.service';
import { Badge } from '@prisma/client';
import { GeneratedBadge } from 'src/generated-badge/entities/generated-badge.entity';
import { SellBadge } from './dto/sell-badge';
import { BuyBadge } from './dto/buy-badge';

@Injectable()
export class BadgeService {
  constructor(private prisma: PrismaService) {}

  create(createBadgeInput: CreateBadgeInput): Promise<Badge> {
    const newBadge = this.prisma.badge.create({
      data: createBadgeInput,
    });
    return newBadge;
  }

  findAll(): Promise<GeneratedBadge[]> {
    return this.prisma.badgeCreated.findMany();
  }

  findOne(id: string): Promise<GeneratedBadge> {
    return this.prisma.badgeCreated.findUnique({
      where: {
        id: id,
      },
    });
  }

  findUserBadges(id: string): Promise<GeneratedBadge[]> {
    return this.prisma.badgeCreated.findMany({
      where: {
        ownerId: id,
        selling: false
      },
      orderBy: {
        clubname: 'asc',
      },
    });
  }

  sellBadge(data: SellBadge): Promise<GeneratedBadge> {
    return this.prisma.badgeCreated.update({
      where: {
        id: data.id,
      },
      data: {
        selling: true,
        price: data.price,
      }, 
    });
  }

  async buyBadge(data: BuyBadge): Promise<GeneratedBadge> {
    const updateOwner = await this.prisma.user.update({
      where: {
        id: data.ownerId,
      },
      data: {
        currency: { increment: data.price },
      },
    });

    const updateUser = await this.prisma.user.update({
      where: {
        id: data.newOwnerId,
      },
      data: {
        currency: { decrement: data.price },
      },
    });

    const updatedBadge = await this.prisma.badgeCreated.update({
      where: {
        id: data.id,
      },
      data: {
        selling: false,
        ownerId: data.newOwnerId,
      },
    });

    return updatedBadge;
  }

  findSellingBadges(): Promise<GeneratedBadge[]> {
    return this.prisma.badgeCreated.findMany({
      where: {
        selling: true,
      },
    });
  }
}
