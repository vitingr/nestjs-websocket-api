import { Injectable } from '@nestjs/common';
import { CreateBadgeInput } from './dto/create-badge.input';
import { PrismaService } from 'src/database/prisma.service';
import { Badge } from '@prisma/client';
import { GeneratedBadge } from 'src/generated-badge/entities/generated-badge.entity';
import { SellBadge } from './dto/sell-badge';
import { BuyBadge } from './dto/buy-badge';
import { QuickSellBadgeProps } from './dto/quick-sell-badge';

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
        selling: false,
      },
      orderBy: {
        clubname: 'asc',
      },
    });
  }

  async sellBadge(data: SellBadge): Promise<GeneratedBadge> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.ownerId,
      },
    });

    if (user.badge === data.id) {
      await this.prisma.user.update({
        where: {
          id: data.ownerId,
        },
        data: {
          badge: '',
          badgeImage: '/assets/undefinedTeam.png',
        },
      });
    }

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

  async quickSellBadge(data: QuickSellBadgeProps): Promise<GeneratedBadge> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.ownerId
      }
    })

    if (user.badge === data.badgeId) {
      await this.prisma.user.update({
        where: {
          id: data.ownerId
        },
        data: {
          badgeImage: "/assets/undefinedTeam.png",
          badge: ""
        }
      })
    }

    const removedBadge = await this.prisma.badgeCreated.delete({
      where: {
        id: data.badgeId
      }
    })

    const updatedUser = await this.prisma.user.update({
      where: {
        id: data.ownerId
      },
      data: {
        currency: {
          increment: data.price
        }
      }
    })

    return removedBadge
  }
}
