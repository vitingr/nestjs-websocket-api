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
  async sendFriendInvite(
    @MessageBody() body: SendFriendInvite
  ) {
    await this.GatewayService.sendFriendInvite(body);

    // this.server.emit('onInvite', {
    //   msg: 'Convite Enviado',
    //   content: body,
    //   socketId: body.socketId,
    // });

    this.server.to(body.socketId).emit('onInvite', {
      msg: 'Convite Enviado',
      content: body,
      socketId: body.socketId,
    })
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
    return this.GatewayService.removeFriend(body)
  }
}
