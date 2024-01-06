import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AcceptMatchModeDto } from 'src/online-mode/dto/accept-match.dto';
import { SendFriendInvite } from 'src/users/dto/send-invite';
import { User } from 'src/users/entities/user-entity';
import { SearchMatch } from './dto/search-match.dto';

@Injectable()
export class GatewayService {
  constructor(private prisma: PrismaService) {}

  sendFriendInvite(sendFriendInvite: SendFriendInvite): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: sendFriendInvite.friendId,
      },
      data: {
        pendingFriends: {
          push: sendFriendInvite.userId,
        },
      },
    });
  }

  async acceptFriendInvite(
    acceptFriendInvite: SendFriendInvite,
  ): Promise<User> {
    const friendId = acceptFriendInvite.friendId;

    const user = await this.prisma.user.findUnique({
      where: {
        id: acceptFriendInvite.userId,
      },
    });

    const updateUser = await this.prisma.user.update({
      where: {
        id: acceptFriendInvite.userId,
      },
      data: {
        pendingFriends: {
          set: user.pendingFriends.filter((friendId) => friendId !== friendId),
        },
        friends: {
          push: acceptFriendInvite.friendId,
        },
        qtdFriends: { increment: 1 },
      },
    });

    const updateFriend = await this.prisma.user.update({
      where: {
        id: acceptFriendInvite.friendId,
      },
      data: {
        friends: {
          push: acceptFriendInvite.userId,
        },
        qtdFriends: { increment: 1 },
      },
    });

    return updateUser;
  }

  async cancelFriendInvite(
    cancelFriendInvite: SendFriendInvite,
  ): Promise<User> {
    const friendId = cancelFriendInvite.friendId;

    const friend = await this.prisma.user.findUnique({
      where: {
        id: cancelFriendInvite.userId,
      },
    });

    const updateFriend = await this.prisma.user.update({
      where: {
        id: cancelFriendInvite.userId,
      },
      data: {
        pendingFriends: {
          set: friend.pendingFriends.filter(
            (friendId) => friendId !== friendId,
          ),
        },
      },
    });

    return updateFriend;
  }

  async removeFriend(removeFriend: SendFriendInvite): Promise<User> {
    const userId = removeFriend.userId;
    const friendId = removeFriend.friendId;

    const user = await this.prisma.user.findUnique({
      where: {
        id: removeFriend.userId,
      },
    });
    const friend = await this.prisma.user.findUnique({
      where: {
        id: removeFriend.friendId,
      },
    });

    const userUpdated = await this.prisma.user.update({
      where: {
        id: removeFriend.userId,
      },
      data: {
        friends: {
          set: user.friends.filter((friendId) => friendId !== friendId),
        },
        qtdFriends: { decrement: 1 },
      },
    });

    const friendUpdated = await this.prisma.user.update({
      where: {
        id: removeFriend.friendId,
      },
      data: {
        friends: {
          set: friend.friends.filter((userId) => userId !== userId),
        },
        qtdFriends: { decrement: 1 },
      },
    });

    return userUpdated;
  }

  async searchMatch(body: SearchMatch) {
    const usersAvaliable = await this.prisma.user.findMany({
      where: {
        searchingMatch: true,
      },
    });

    if (usersAvaliable.length > 0) {
      // Já possuem usuários buscando partidas
      let choosedUser =
        usersAvaliable[Math.floor(Math.random() * usersAvaliable.length)];

      const newMatch = await this.prisma.match.create({
        data: {
          userId: body.id,
          opponentId: choosedUser.id,
        },
      });

      return [choosedUser, newMatch];
    } else {
      // Não existe nenhum usuário já buscando alguma partida
      await this.prisma.user.update({
        where: {
          id: body.id,
        },
        data: {
          searchingMatch: true,
        },
      });

      return false;
    }
  }

  async acceptMatch(data: AcceptMatchModeDto) {
    let currentStatus: boolean

    const match = await this.prisma.match.findUnique({
      where: {
        id: data.matchId,
      },
    });

    if (data.userId === match.userId) {
      if (data.cancel === false) {
        await this.prisma.match.update({
          where: {
            id: data.matchId,
          },
          data: {
            userAccepted: true,
          },
        });
        currentStatus = true
      } else {
        await this.prisma.match.update({
          where: {
            id: data.matchId,
          },
          data: {
            userAccepted: false,
          },
        });
        currentStatus = false
      }
    }

    if (data.userId === match.opponentId) {
      if (data.cancel === false) {
        await this.prisma.match.update({
          where: {
            id: data.matchId,
          },
          data: {
            opponentAccepted: true,
          },
        });
        currentStatus = true
      } else {
        await this.prisma.match.update({
          where: {
            id: data.matchId,
          },
          data: {
            opponentAccepted: false,
          },
        });
        currentStatus = false
      }
    }

    if (match.opponentAccepted === true || match.userAccepted === true && currentStatus === true) {
      return [true, match.userId, match.opponentId, match.id];
    } else {
      return [false]
    }
  }
}
