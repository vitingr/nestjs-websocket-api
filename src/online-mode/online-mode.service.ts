import { Injectable } from '@nestjs/common';
import { CreateOnlineModeDto } from './dto/create-online-mode.dto';
import { UpdateOnlineModeDto } from './dto/update-online-mode.dto';
import { User } from 'src/users/entities/user-entity';
import { PrismaService } from 'src/database/prisma.service';
import { AcceptMatchModeDto } from './dto/accept-match.dto';

@Injectable()
export class OnlineModeService {

  constructor(private prisma: PrismaService) {}

  create(createOnlineModeDto: CreateOnlineModeDto) {
    return 'This action adds a new onlineMode';
  }

  findAll() {
    return `This action returns all onlineMode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} onlineMode`;
  }

  update(id: number, updateOnlineModeDto: UpdateOnlineModeDto) {
    return `This action updates a #${id} onlineMode`;
  }

  remove(id: number) {
    return `This action removes a #${id} onlineMode`;
  }

  // async searchMatch(body: string) {
  //   await this.prisma.user.update({
  //     where: {
  //       id: body.id
  //     },
  //     data: {
  //       searchingMatch: true
  //     }
  //   })
  // }

  // async acceptMatch(data: AcceptMatchModeDto) {
  //   await this.prisma.match.create({
  //     data: {
  //       userId: data.userId,
  //       opponentId: data.opponentId
  //     }
  //   })

  //   await this.prisma.user.update({
  //     where: {
  //       id: data.userId
  //     },
  //     data: {
  //       searchingMatch: false
  //     }
  //   })

  //   await this.prisma.user.update({
  //     where: {
  //       id: data.opponentId
  //     },
  //     data: {
  //       searchingMatch: false
  //     }
  //   })
  // }
}
