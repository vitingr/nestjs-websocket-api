import { Injectable } from '@nestjs/common';
import { CreateLineupInput } from './dto/create-lineup.input';
import { UpdateLineupInput } from './dto/update-lineup.input';
import { Lineup } from './entities/lineup.entity';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateLineupCard } from './dto/update-lineup-card';
import { PlayerCardProps } from 'types';
import { SelectLineup } from './dto/select-lineup';
import { User } from 'src/users/entities/user-entity';
import { RemoveLineupPlayer } from './dto/remove-player';

@Injectable()
export class LineupsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateLineupInput): Promise<Lineup> {
    const newLineup = this.prisma.lineup.create({
      data: data,
    });

    return newLineup;
  }

  findAll(): Promise<Lineup[]> {
    return this.prisma.lineup.findMany();
  }

  findOne(id: string): Promise<Lineup> {
    return this.prisma.lineup.findUnique({
      where: {
        id: id,
      },
    });
  }

  getUserLineups(userId: string): Promise<Lineup[]> {
    return this.prisma.lineup.findMany({
      where: {
        owner: userId,
      },
    });
  }

  deleteUserLineup(id: string): Promise<Lineup> {
    return this.prisma.lineup.delete({
      where: {
        id: id,
      },
    });
  }

  updateLineupCard(data: UpdateLineupCard): Promise<Lineup> {
    // const newCardData: PlayerCardProps = JSON.parse(JSON.stringify(data.playerData));
    // {
    //   id: newCardData.id,
    //   cardImage: newCardData.cardImage,
    //   owner: newCardData.owner,
    //   selling: newCardData.selling,
    //   playerId: newCardData.playerId,
    //   name: newCardData.name,
    //   club: newCardData.club,
    //   league: newCardData.league,
    //   type: newCardData.type,
    //   overall: newCardData.overall,
    //   pace: newCardData.pace,
    //   finalization: newCardData.finalization,
    //   pass: newCardData.pass,
    //   drible: newCardData.drible,
    //   defense: newCardData.defense,
    //   physic: newCardData.physic,
    //   minValue: newCardData.minValue,
    //   maxValue: newCardData.maxValue,
    //   quickSellValue: newCardData.quickSellValue,
    //   position: newCardData.position,
    // },

    return this.prisma.lineup
      .update({
        where: {
          id: data.lineupId,
        },
        data: {
          [`player${data.index}`]: data.playerData,
        },
      })
      .then((updatedLineup) => {
        return {
          ...updatedLineup,
        };
      });
  }

  selectLineup(data: SelectLineup): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: data.userId,
      },
      data: {
        currentLineup: data.lineupId,
      },
    });
  }

  async findUserCurrentLineup(id: string): Promise<Lineup> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    const lineup = await this.prisma.lineup.findUnique({
      where: {
        id: user.currentLineup,
      },
    });

    return lineup;
  }

  async removeLineupPlayer(data: RemoveLineupPlayer): Promise<Lineup> {
    let lineupUpdated: any
    
    if (data.position.startsWith('player')) {
      const playerNumber = parseInt(data.position.slice(6));
      if (!isNaN(playerNumber) && playerNumber >= 1 && playerNumber <= 11) {
        lineupUpdated = await this.prisma.lineup.update({
          where: {
            id: data.lineupId,
          },
          data: {
            [`player${playerNumber}`]: null,
          },
        });
      }
    }

    return lineupUpdated
  }
}
