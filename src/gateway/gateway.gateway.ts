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
import { Lineup } from '@prisma/client';

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
  private availableCardsPerPlayer: { [username: string]: Lineup } = {};
  private roundCount: number = 0;
  private player1_score: number = 0;
  private player2_score: number = 0;

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
    // Pegar os dados do usuário para a criação de uma nova partida
    const response = await this.GatewayService.searchMatch(body);

    // Encontrar uma partida para o usuário
    if (response) {
      this.server.emit('matchFound', {
        msg: 'Partida foi encontrada',
        userId: response[0].id,
        matchId: response[1].id,
      });

      // Caso a partida seja encontrada emitir esse evento
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

    // Caso seja aceita por ambos, emitir esse evento
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
  async handleJoinGame(client: Socket, data: JoinGameDto) {
    // Verificar se o usuário já está conectado dentro do servidor
    if (this.players[data.username]) {
      console.log(`Usuário ${data.username} já está conectado.`);
    }

    // Adicione o jogador à lista
    this.players[data.username] = client;

    // Emita o evento 'gameJoined' para todos os jogadores (incluindo o recém-conectado)
    const allPlayers = Object.keys(this.players);

    // Use Promise.all para esperar que todas as emissões sejam concluídas
    await Promise.all(
      allPlayers.map(async (username) => {
        const playerClient = this.players[username];

        // Use uma Promise para aguardar a conclusão da emissão
        return new Promise(async () => {
          playerClient.emit('gameJoined', {
            players: allPlayers,
            matchId: data.matchId,
          });
          if (Object.keys(this.players).length === 2) {
            await this.startRound();
          }
        });
      }),
    );
  }

  @SubscribeMessage('chooseCard')
  handleChoosedCard(client: Socket, cardValue: number) {
    // Buscar o usuário através do SocketID
    const username = this.getUsernameBySocket(client);

    // Verificar se o jogador já escolheu uma carta nesta rodada
    if (!this.chosenCards[username]) {
      this.chosenCards[username] = cardValue;

      if (Object.keys(this.chosenCards).length === 2) {
        this.resolveRound();
      }
    }
  }

  private async startRound() {
    // // Iniciar uma nova rodada, notificando os jogadores
    this.roundCount++;
    this.broadcast('startRound', this.roundCount);

    const userLineupAvailableCards =
      await this.GatewayService.getUserAvailableCards(
        Object.keys(this.players),
      );

    const allPlayers = Object.keys(this.players);

    // Use Promise.all para esperar que todas as emissões sejam concluídas
    await Promise.all(
      allPlayers.map(async () => {
        // Use uma Promise para aguardar a conclusão da emissão
        return new Promise(async () => {
          this.broadcast(
            'availableCards',
            JSON.stringify(userLineupAvailableCards),
          );
        });
      }),
    );
  }

  private resolveRound() {
    // Comparar se as cartas escolhidas e determine o vencedor da rodada
    const usernames = Object.keys(this.chosenCards);

    // Players Data
    const player1 = usernames[0];
    const player2 = usernames[1];

    // Carta escolhida pelo usuário durante a rodada
    const card1 = this.chosenCards[player1];
    const card2 = this.chosenCards[player2];

    let winner: string;

    if (card1 > card2) {
      winner = player1;
      this.player1_score++;
    } else {
      if (card1 < card2) {
        winner = player2;
        this.player2_score++;
      } else {
        winner = 'draw';
      }
    }

    // Notificar os jogadores sobre o vencedor da rodada
    this.broadcast('roundWinner', { winner, card1, card2 });

    // Reinicie as escolhas de cartas para a próxima rodada
    this.chosenCards = {};

    // Inicie a próxima rodada
    if (this.roundCount < 11) {
      this.startRound();
    } else {
      this.resolveMatch();
    }
  }

  private resolveMatch() {
    const usernames = Object.keys(this.players);

    // Players Data
    const player1 = usernames[0];
    const player2 = usernames[1];

    if (this.player1_score > this.player2_score) {
      this.broadcast('matchWinner', player1);
      this.GatewayService.giveMatchPrize(player1, player2);
    } else {
      if (this.player2_score > this.player1_score) {
        this.broadcast('matchWinner', player2);
        this.GatewayService.giveMatchPrize(player2, player1);
      } else {
        this.broadcast('matchWinner', 'Draw');
        this.GatewayService.giveDrawPrize(player1, player2);
      }
    }
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
