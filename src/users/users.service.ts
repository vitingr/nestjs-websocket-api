import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { User } from './entities/user-entity';
import { CreateUser } from './dto/create-user';
import { ChangeClubName } from './dto/change-club-name';
import { ChangeClubBadge } from './dto/change-club-badge';
import { CompleteQuizProps } from './dto/complete-quiz';
import { Challenge1Props } from './dto/challenge1';
import { Challenge2Props } from './dto/challenge2';
import { GeneratedCard } from 'src/generated-cards/entities/generated-card.entity';
import { PlayerCardGenerated } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findOne(uuid: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({orderBy: {
      points: 'desc'
    }});
  }

  createUser(data: CreateUser): Promise<User> {
    const newUser = this.prisma.user.create({
      data: data,
    });
    return newUser;
  }

  async getUserFriends(friends: string[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: friends,
        },
      },
    });
    return users;
  }

  async getUserPendingFriends(playersId: string[]): Promise<User[]> {
    const validPlayerIds = playersId.filter((id) => id.trim() !== '');
    const usersData = await this.prisma.user.findMany({
      where: {
        id: {
          in: validPlayerIds,
        },
      },
    });
    return usersData;
  }

  async changeClubName(data: ChangeClubName): Promise<User> {
    const updateUser = await this.prisma.user.update({
      where: {
        id: data.userId,
      },
      data: {
        clubname: data.clubname,
      },
    });

    return updateUser;
  }

  useMenuDriver(id: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        driverMenu: true,
      },
    });
  }

  useHomeDriver(id: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        driverHome: true,
      },
    });
  }

  useLineupDriver(id: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        driverLineup: true,
      },
    });
  }

  useProfileDriver(id: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        driverProfile: true,
      },
    });
  }

  findOneUser(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  changeClubBadge(changeClubBadge: ChangeClubBadge): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: changeClubBadge.userId,
      },
      data: {
        badge: changeClubBadge.clubBadge,
        badgeImage: changeClubBadge.badgeImage
      },
    });
  }

  completeQuiz(data: CompleteQuizProps): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: data.userId
      },
      data: {
        quizCompleted: {
          push: data.quiz
        },
        currency: {
          increment: data.prize
        }
      }
    })
  }

  async completeChallenge1(data: Challenge1Props): Promise<User> {
    const updatedCards = await this.prisma.playerCardGenerated.deleteMany({
      where: {
        id: {
          in: [data.player1, data.player2, data.player3]
        }
      }
    })

    const userUpdated = await this.prisma.user.update({
      where: {
        id: data.userId
      },
      data: {
        currency: {
          increment: 1000
        },
        dmeCompleted: {
          push: "challenge1"
        }
      }
    })

    return userUpdated
  }

  async completeChallenge2(data: Challenge2Props): Promise<PlayerCardGenerated> {
    const playerData = {
      cardImage: "http://res.cloudinary.com/djwne0azq/image/upload/v1708024390/ha9pm03wp0bfffzn75vv.png",
      owner: data.userId,
      selling: false,
      playerId: "65ce6248dc00cca7859adc2e",
      name: "Bastos",
      club: "Botafogo",
      league: "Brasileirão Série A",
      type: "SBC",
      position: "Zagueiro",
      overall: 76,
      pace: 70,
      finalization: 44,
      pass: 59,
      drible: 54,
      defense: 76,
      physic: 82,
      minValue: 350,
      maxValue: 500,
      quickSellValue: 350,
    }

    const createdCard = await this.prisma.playerCardGenerated.create({
      data: playerData
    })

    const updatedUser = await this.prisma.user.update({
      where: {
        id: data.userId
      },
      data: {
        dmeCompleted: {
          push: "challenge2"
        }
      }
    })

    return createdCard
  }
}
