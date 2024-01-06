import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './gateway.service';
import { SendFriendInvite } from 'src/users/dto/send-invite';
import { User } from 'src/users/entities/user-entity';
import { AcceptMatchModeDto } from 'src/online-mode/dto/accept-match.dto';
import { SearchMatch } from './dto/search-match.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly GatewayService: GatewayService) {}

  onModuleInit() {
    console.log('Iniciando Servidor...');
    this.server.on('connection', (socket) => {});
  }

  @SubscribeMessage('inviteUser')
  sendFriendInvite(@MessageBody() body: SendFriendInvite) {
    return this.GatewayService.sendFriendInvite(body);

    // this.server.emit('onInvite', {
    //   msg: 'Convite Enviado',
    //   content: body,
    //   socketId: body.socketId,
    // });

    // this.server.to(body.socketId).emit('onInvite', {
    //   msg: 'Convite Enviado',
    //   content: body,
    //   socketId: body.socketId,
    // })
  }

  @SubscribeMessage('acceptInvite')
  acceptFriendInvite(@MessageBody() body: SendFriendInvite): Promise<User> {
    return this.GatewayService.acceptFriendInvite(body);
  }

  @SubscribeMessage('cancelInvite')
  cancelFriendInvite(@MessageBody() body: SendFriendInvite): Promise<User> {
    return this.GatewayService.cancelFriendInvite(body);
  }

  @SubscribeMessage('removeFriend')
  removeFriend(@MessageBody() body: SendFriendInvite): Promise<User> {
    return this.GatewayService.removeFriend(body);
  }

  @SubscribeMessage('searchMatch')
  async searchMatch(@MessageBody() body: SearchMatch) {
    const response = await this.GatewayService.searchMatch(body);

    if (response) {
      this.server.emit('matchFound', {
        msg: 'Partida foi encontrada',
        userId: response[0].id,
        matchId: response[1].id,
      });

      this.server.emit('matchFound', {
        msg: 'Partida foi encontrada',
        userId: body.id,
        matchId: response[1].id,
      });
    }
  }

  @SubscribeMessage('acceptMatch')
  async acceptMatch(@MessageBody() body: AcceptMatchModeDto) {

    const response = await this.GatewayService.acceptMatch(body);

    if (response[0] === true) {
      this.server.emit('matchAccepted', {
        msg: 'Partida aceita por ambos dos jogadores',
        userId: response[1],
        matchId: response[3],
      });

      this.server.emit('matchAccepted', {
        msg: 'Partida aceita por ambos dos jogadores',
        userId: response[2],
        matchId: response[3],
      });
    }
  }
}
