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
import { AcceptMatchModeDto } from './dto/accept-match.dto'; 
import { SearchMatch } from './dto/search-match.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { Lineup } from '@prisma/client';
import { GeneratedCard } from 'src/generated-cards/entities/generated-card.entity';


@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly GatewayService: GatewayService) {}

  private players: { [key: string]: Socket } = {};
  private chosenCards: { [key: string]: GeneratedCard } = {};
  private currentStat: string = 'free';
  private usedCards: string[] = [];
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

  @SubscribeMessage('stopSearchingMatch')
  async stopSearchingMatch(@MessageBody() body: SearchMatch): Promise<User> {
    return this.GatewayService.stopSearchingMatch(body)
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

    if (this.currentTurn) {
      // Emita o evento 'gameJoined' para todos os jogadores (incluindo o recém-conectado)
      for (const username of allPlayers) {
        const playerClient = this.players[username];
        playerClient.emit('gameJoined', {
          players: allPlayers,
          matchId: data.matchId,
        });
        playerClient.emit('currentTurn', {
          turn: this.currentTurn,
          currentStat: this.currentStat,
        });
        this.playerAcknowledgments[username] = true;
      }

      // Iniciar a rodada se houver 2 jogadores
      if (allPlayers.length === 2) {
        if (this.allPlayersAcknowledged()) {
          await this.startRound();
        }
      }
    }
  }

  @SubscribeMessage('chooseCard')
  async handleChoosedCard(
    client: Socket,
    data: { card: GeneratedCard; stat: string },
  ) {
    this.resetPlayerAcknowledgments();

    this.currentStat = data.stat;

    const allPlayers = Object.keys(this.players);

    await this.changeTurn();

    for (const username of allPlayers) {
      const playerClient = this.players[username];

      playerClient.emit('currentTurn', {
        turn: this.currentTurn,
        currentStat: data.stat,
      });
      this.playerAcknowledgments[username] = true;
    }

    if (this.allPlayersAcknowledged()) {
      // Buscar o usuário através do SocketID
      const username = this.getUsernameBySocket(client);

      // Verificar se o jogador já escolheu uma carta nesta rodada
      if (!this.chosenCards[username]) {
        if (Object.values(this.chosenCards)) {
          this.chosenCards[username] = data.card;

          if (Object.keys(this.chosenCards).length === 2) {
            this.resolveRound();
          }
        }
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
      playerClient.emit('currentTurn', {
        turn: this.currentTurn,
        currentStat: this.currentStat,
      });

      this.playerAcknowledgments[username] = true;
    }
  }

  private async resolveRound() {
    this.resetPlayerAcknowledgments();

    // Comparar se as cartas escolhidas e determine o vencedor da rodada
    const allPlayers = Object.keys(this.chosenCards).sort();

    // Players Data
    const player1 = allPlayers[0];
    const player2 = allPlayers[1];

    // Carta escolhida pelo usuário durante a rodada
    const card1 = this.chosenCards[allPlayers[0]];
    const card2 = this.chosenCards[allPlayers[1]];

    // Salvar a carta como já utilizada
    this.usedCards.push(card1.id);
    this.usedCards.push(card2.id);

    let winner: string;
    let usedCards: string[] = this.usedCards;

    winner = await this.checkRoundWinner(
      player1,
      player2,
      card1,
      card2,
      this.currentStat,
    );

    const player1Score = this.player1_score;
    const player2Score = this.player2_score;

    for (const username of allPlayers) {
      const playerClient = this.players[username];

      // Notificar os jogadores sobre o vencedor da rodada
      playerClient.emit('roundWinner', {
        winner,
        card1,
        card2,
        player1Score,
        player2Score,
        usedCards,
      });

      this.playerAcknowledgments[username] = true;
    }

    if (this.allPlayersAcknowledged()) {
      // Reinicie as escolhas de cartas para a próxima rodada
      this.chosenCards = {};

      // Inicie a próxima rodada
      if (this.roundCount < 11) {
        this.currentStat = 'free';
        await this.startRound();
      } else {
        this.resolveMatch();
      }
    }
  }

  private resolveMatch() {
    this.resetPlayerAcknowledgments();

    const allPlayers = Object.keys(this.players);

    // Players Data
    const player1 = allPlayers[0];
    const player2 = allPlayers[1];

    for (const username of allPlayers) {
      const playerClient = this.players[username];

      if (this.player1_score > this.player2_score) {
        playerClient.emit('matchWinner', {
          winner: player1,
          loser: player2,
        });
        this.GatewayService.giveMatchPrize(player1, player2);
      } else {
        if (this.player2_score > this.player1_score) {
          playerClient.emit('matchWinner', {
            winner: player2,
            loser: player1,
          });
          this.GatewayService.giveMatchPrize(player2, player1);
        } else {
          playerClient.emit('matchWinner', {
            winner: 'draw',
            loser: 'draw',
          });
          this.GatewayService.giveDrawPrize(player1, player2);
        }
      }

      this.playerAcknowledgments[username] = true;
    }

    if (this.allPlayersAcknowledged()) {
      console.log('Partida acabou');
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
      playerClient.emit('currentTurn', {
        turn: this.currentTurn,
        currentStat: this.currentStat,
      });

      this.playerAcknowledgments[username] = true;
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

  private resetPlayerAcknowledgments(): void {
    // Vai gerar uma cópia do objeto original antes de redefinir
    this.playerAcknowledgments = { ...this.playerAcknowledgments };

    // Redefinir o objeto sem afetar o original
    for (const playerId of Object.keys(this.playerAcknowledgments)) {
      this.playerAcknowledgments[playerId] = false;
    }
  }

  private async checkRoundWinner(
    player1: string,
    player2: string,
    card1: GeneratedCard,
    card2: GeneratedCard,
    stat: string,
  ) {

    if (stat === 'pace') {
      if (card1.pace > card2.pace) {
        this.player1_score += 1;

        if (player1 !== this.currentTurn) {
          this.changeTurn();
        }
        return player1;
      } else {
        if (card1.pace < card2.pace) {
          this.player2_score += 1;

          if (player2 !== this.currentTurn) {
            this.changeTurn();
          }
          return player2;
        } else {
          return 'draw';
        }
      }
    }
    if (stat === 'finalization') {
      if (card1.finalization > card2.finalization) {
        this.player1_score += 1;

        if (player1 !== this.currentTurn) {
          this.changeTurn();
        }
        return player1;
      } else {
        if (card1.finalization < card2.finalization) {
          this.player2_score += 1;

          if (player2 !== this.currentTurn) {
            this.changeTurn();
          }
          return player2;
        } else {
          return 'draw';
        }
      }
    }
    if (stat === 'pass') {
      if (card1.pass > card2.pass) {
        this.player1_score += 1;

        if (player1 !== this.currentTurn) {
          this.changeTurn();
        }
        return player1;
      } else {
        if (card1.pass < card2.pass) {
          this.player2_score += 1;

          if (player2 !== this.currentTurn) {
            this.changeTurn();
          }
          return player2;
        } else {
          return 'draw';
        }
      }
    }
    if (stat === 'drible') {
      if (card1.drible > card2.drible) {
        this.player1_score += 1;

        if (player1 !== this.currentTurn) {
          this.changeTurn();
        }
        return player1;
      } else {
        if (card1.drible < card2.drible) {
          this.player2_score += 1;

          if (player2 !== this.currentTurn) {
            this.changeTurn();
          }
          return player2;
        } else {
          return 'draw';
        }
      }
    }
    if (stat === 'defense') {
      if (card1.defense > card2.defense) {
        this.player1_score += 1;

        if (player1 !== this.currentTurn) {
          this.changeTurn();
        }
        return player1;
      } else {
        if (card1.defense < card2.defense) {
          this.player2_score += 1;

          if (player2 !== this.currentTurn) {
            this.changeTurn();
          }
          return player2;
        } else {
          return 'draw';
        }
      }
    }
    if (stat === 'physic') {
      if (card1.physic > card2.physic) {
        this.player1_score += 1;

        if (player1 !== this.currentTurn) {
          this.changeTurn();
        }
        return player1;
      } else {
        if (card1.physic < card2.physic) {
          this.player2_score += 1;

          if (player2 !== this.currentTurn) {
            this.changeTurn();
          }
          return player2;
        } else {
          return 'draw';
        }
      }
    }
  }
}
