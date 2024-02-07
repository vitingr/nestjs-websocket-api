import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { User } from './entities/user-entity';
import { CreateUser } from './dto/create-user';
import { ChangeClubName } from './dto/change-club-name';
import { ChangeClubBadge } from './dto/change-club-badge';
import { CompleteQuizProps } from './dto/complete-quiz';

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
}
