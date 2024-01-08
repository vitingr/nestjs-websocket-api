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
import { JoinGameDto } from './dto/join-game.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly GatewayService: GatewayService) {}

  private players: { [key: string]: Socket } = {};
  private chosenCards: { [key: string]: number } = {};
  private roundCount: number = 0;

  onModuleInit() {
    console.log('Iniciando Servidor...');
    this.server.on('connection', (socket) => {});
  }

  @SubscribeMessage('inviteUser')
  sendFriendInvite(@MessageBody() body: SendFriendInvite) {
    return this.GatewayService.sendFriendInvite(body);
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

  // Logicas do Jogo
  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, data: JoinGameDto) {
    if (this.players[data.username]) {
      console.log(`Usuário ${data.username} já está conectado.`);
      return;
    }
  
    // Adicione o jogador à lista
    this.players[data.username] = client;
  
    // Emita o evento 'gameJoined' para o jogador que acabou de se conectar
    client.emit('gameJoined', {
      players: Object.keys(this.players),
    });
  
    // Verifique se há dois jogadores e inicie a rodada se necessário
    if (Object.keys(this.players).length === 2) {
      this.startRound();
    }
  
    // Emita o evento 'gameJoined' para todos os jogadores (incluindo o recém-conectado)
    Object.values(this.players).forEach(playerClient => {
      playerClient.emit('gameJoined', {
        players: Object.keys(this.players),
        matchId: data.matchId,
      });
    });
  }

  @SubscribeMessage('chooseCard')
  handleChoosedCard(client: Socket, cardValue: number) {
    const username = this.getUsernameBySocket(client);

    // Verificar se o jogador já escolheu uma carta nesta rodada
    if (!this.chosenCards[username]) {
      this.chosenCards[username] = cardValue;

      if (Object.keys(this.chosenCards).length === 2) {
        this.resolveRound();
      }
    }
  }

  private startRound() {
    // Iniciar uma nova rodada, notificando os jogadores
    this.roundCount++;
    this.broadcast('startRound', this.roundCount);

    // Enviar a lista de cartas disponíveis para os jogadores
    const avaliableCards = [1, 2, 3, 4, 5];
    this.broadcast('avaliableCards', avaliableCards);
  }

  private resolveRound() {
    // Comparar se as cartas escolhidas e determine o vencedor da rodada
    const usernames = Object.keys(this.chosenCards);

    const player1 = usernames[0];
    const player2 = usernames[1];

    const card1 = this.chosenCards[player1];
    const card2 = this.chosenCards[player2];

    let winner: string;

    if (card1 > card2) {
      winner = player1;
    } else {
      if (card1 < card2) {
        winner = player2;
      } else {
        winner = 'draw';
      }
    }

    // Notificar os jogadores sobre o vencedor da rodada
    this.broadcast('roundWinner', { winner, card1, card2 });

    // Reinicie as escolhas de cartas para a próxima rodada
    this.chosenCards = {};

    // Inicie a próxima rodada
    this.startRound();
  }

  private getUsernameBySocket(client: Socket): string {
    return Object.keys(this.players).find(
      (username) => this.players[username] === client,
    );
  }

  private broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
