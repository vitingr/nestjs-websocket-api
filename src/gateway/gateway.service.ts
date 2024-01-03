import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SendFriendInvite } from 'src/users/dto/send-invite';
import { User } from 'src/users/entities/user-entity';

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
          set: friend.pendingFriends.filter((friendId) => friendId !== friendId),
        },
      },
    });

    return updateFriend;
  }
}
