import { Injectable } from '@nestjs/common';
import { CreateBadgeInput } from './dto/create-badge.input';
import { UpdateBadgeInput } from './dto/update-badge.input';
import { PrismaService } from 'src/database/prisma.service';
import { Badge } from '@prisma/client';

@Injectable()
export class BadgeService {

  constructor(private prisma: PrismaService) {}

  create(createBadgeInput: CreateBadgeInput): Promise<Badge> {
    const newBadge = this.prisma.badge.create({
      data: createBadgeInput
    })
    return newBadge
  }

  findAll(): Promise<Badge[]> {
    return this.prisma.badge.findMany()
  }

  findOne(id: string): Promise<Badge> {
    return this.prisma.badge.findUnique({
      where: {
        id: id
      }
    })
  }
}
