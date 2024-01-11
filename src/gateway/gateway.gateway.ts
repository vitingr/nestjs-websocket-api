import { All, OnModuleInit } from '@nestjs/common';
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
  private currentTurn: string = '';
  private roundCount: number = 0;
  private player1_score: number = 0;
  private player2_score: number = 0;
  private playerAcknowledgments: { [playerId: string]: boolean } = {};

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
    this.playerAcknowledgments = {};

    // Verificar se o usuário já está conectado dentro do servidor
    if (this.players[data.username]) {
      console.log(`Usuário ${data.username} já está conectado.`);
      return;
    }

    // Adicione o jogador à lista
    this.players[data.username] = client;

    // Obter a lista de todos os jogadores
    const allPlayers = Object.keys(this.players);

    // Gerar um índice aleatório
    const indiceAleatorio = Math.floor(Math.random() * allPlayers.length);

    // Acessar o valor correspondente ao índice aleatório
    const sortedUser = allPlayers[indiceAleatorio];
    this.currentTurn = sortedUser;

    console.log(`usuario sorteado: ${this.currentTurn}`);

    if (this.currentTurn) {
      // Emita o evento 'gameJoined' para todos os jogadores (incluindo o recém-conectado)
      for (const username of allPlayers) {
        const playerClient = this.players[username];
        playerClient.emit('gameJoined', {
          players: allPlayers,
          matchId: data.matchId,
        });
        playerClient.emit('currentTurn', this.currentTurn);
        this.playerAcknowledgments[username] = true;
      }

      // Iniciar a rodada se houver 2 jogadores
      if (allPlayers.length === 2) {
        if (this.allPlayersAcknowledged()) {
          this.handleAllPlayersAcknowledged();

          await this.startRound();
        }
      }
    }
  }

  @SubscribeMessage('chooseCard')
  async handleChoosedCard(client: Socket, cardValue: number) {
    const allPlayers = Object.keys(this.players);

    await this.changeTurn();

    await Promise.all(
      allPlayers.map(async (player) => {
        await new Promise<void>((resolve) => {
          this.broadcast('currentTurn', this.currentTurn);
          resolve();
        });
      }),
    );

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
    this.resetPlayerAcknowledgments();

    // Iniciar uma nova rodada, notificando os jogadores
    this.roundCount++;
    this.broadcast('startRound', this.roundCount);

    const userLineupAvailableCards =
      await this.GatewayService.getUserAvailableCards(
        Object.keys(this.players),
      );

    const allPlayers = Object.keys(this.players);

    for (const username of allPlayers) {
      const playerClient = this.players[username];
      playerClient.emit(
        'availableCards',
        JSON.stringify(userLineupAvailableCards),
      );

      console.log('Adicinou alguem na lista');
      this.playerAcknowledgments[username] = true;
    }

    console.log(this.playerAcknowledgments);

    if (this.allPlayersAcknowledged()) {
      console.log('Round começou para todos');
    }
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

    const player1Score = this.player1_score;
    const player2Score = this.player2_score;

    let winner: string;

    if (card1 > card2) {
      winner = player1;
      this.player1_score++;

      if (player1 !== this.currentTurn) {
        this.changeTurn();
      }
    } else {
      if (card1 < card2) {
        winner = player2;
        this.player2_score++;

        if (player2 !== this.currentTurn) {
          this.changeTurn();
        }
      } else {
        winner = 'draw';
      }
    }

    // Notificar os jogadores sobre o vencedor da rodada
    this.broadcast('roundWinner', {
      winner,
      card1,
      card2,
      player1Score,
      player2Score,
    });

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

  private async changeTurn() {
    this.resetPlayerAcknowledgments();

    const usernames = Object.keys(this.players);

    const player1 = usernames[0];
    const player2 = usernames[1];

    if (this.currentTurn === player1) {
      this.currentTurn = player2;
    } else {
      this.currentTurn = player1;
    }

    for (const username of usernames) {
      const playerClient = this.players[username];
      playerClient.emit('currentTurn', this.currentTurn);

      this.playerAcknowledgments[username] = true;
    }

    if (this.allPlayersAcknowledged()) {
      console.log('Trocando jogador da rodada');
    } else {
      console.log('Algum jogador não recebeu a mensagem');
    }
  }

  // Checar se todos os usuários receberam a mensagem
  private allPlayersAcknowledged(): boolean {
    const playerIds = Object.keys(this.playerAcknowledgments);
    return (
      playerIds.length === 2 &&
      playerIds.every((playerId) => this.playerAcknowledgments[playerId])
    );
  }

  private handleAllPlayersAcknowledged(): void {
    console.log('Todos jogadores receberam o emit');
  }

  private resetPlayerAcknowledgments(): void {
    // Vai gerar uma cópia do objeto original antes de redefinir
    this.playerAcknowledgments = { ...this.playerAcknowledgments };

    // Redefinir o objeto sem afetar o original
    for (const playerId of Object.keys(this.playerAcknowledgments)) {
      this.playerAcknowledgments[playerId] = false;
    }
  }
}
