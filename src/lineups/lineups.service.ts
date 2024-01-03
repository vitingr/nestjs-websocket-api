import { Injectable } from '@nestjs/common';
import { CreateLineupInput } from './dto/create-lineup.input';
import { UpdateLineupInput } from './dto/update-lineup.input';
import { Lineup } from './entities/lineup.entity';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LineupsService {

  constructor(private prisma: PrismaService) {}

  create(data: CreateLineupInput): Promise<Lineup> {
    const newLineup = this.prisma.lineup.create({
      data: data
    })

    return newLineup
  }

  findAll(): Promise<Lineup[]> {
    return this.prisma.lineup.findMany()
  }

  findOne(id: string): Promise<Lineup> {
    return this.prisma.lineup.findUnique({
      where: {
        id: id
      }
    })
  }

  getUserLineups(userId: string): Promise<Lineup[]> {
    return this.prisma.lineup.findMany({
      where: {
        owner: userId
      }
    })
  }

}
