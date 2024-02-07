import { Injectable } from '@nestjs/common';
import { CreateGeneratedCardInput } from './dto/create-generated-card.input';
import { UpdateGeneratedCardInput } from './dto/update-generated-card.input';
import { GeneratedCard } from './entities/generated-card.entity';
import { PrismaService } from 'src/database/prisma.service';
import { Card } from 'src/cards/entities/card.entity';
import { SellCard } from './dto/sell-card';
import { PlayerCardProps } from 'types';
import { Badge } from '@prisma/client';
import { GeneratedBadge } from 'src/generated-badge/entities/generated-badge.entity';
import { QuickSellProps } from './dto/quick-sell';
import { User } from 'src/users/entities/user-entity';
import { PickStarterTeamProps } from './dto/pick-starter-team';
import { ClubSetupProps } from './dto/finish-club-setup';
import { OpenPackProps } from './dto/open-pack';

@Injectable()
export class GeneratedCardsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateGeneratedCardInput): Promise<GeneratedCard> {
    const createdCard = this.prisma.playerCardGenerated.create({
      data: data,
    });
    return createdCard;
  }

  findAll(): Promise<GeneratedCard[]> {
    return this.prisma.playerCardGenerated.findMany();
  }

  findOne(id: string): Promise<GeneratedCard> {
    return this.prisma.playerCardGenerated.findUnique({
      where: {
        id: id,
      },
    });
  }

  findUserCards(id: string): Promise<GeneratedCard[]> {
    return this.prisma.playerCardGenerated.findMany({
      where: {
        owner: id,
        selling: false,
      },
      orderBy: {
        overall: 'desc',
      },
    });
  }

  getSellingCards(): Promise<GeneratedCard[]> {
    return this.prisma.playerCardGenerated.findMany({
      where: {
        selling: true,
      },
    });
  }

  async sellCard(data: SellCard): Promise<GeneratedCard> {
    // Vai buscar todas as lineups do usuário
    const lineups = await this.prisma.lineup.findMany({
      where: {
        owner: data.ownerId,
      },
    });

    // Vai realizar um laço de repetição para cada lineup do usuário
    for (const lineup of lineups) {
      // Vai armazenar os dados de cada jogador da respectiva escalação
      const players: GeneratedCard[] = [];

      for (let i = 1; i <= 11; i++) {
        if (
          // Validação se o campo da escalação está preenchido
          lineup[`player${i}`] !== undefined ||
          lineup[`player${i}`] !== null
        ) {
          // Vai buscar o jogador respectivo aquele index de busca
          const player: GeneratedCard = JSON.parse(lineup[`player${i}`]);
          players.push(player);
        }
      }

      // Vai verificar se o ID do player que está sendo vendido é equivalente ao jogador daquela escalação
      if (players[0]?.id === data.playerId) {
        // Caso o jogador estava relacionado com esssa escalação, vai remover ele e deixar o campo nulo
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player1: null,
          },
        });
      }

      if (players[1]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player2: null,
          },
        });
      }

      if (players[2]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player3: null,
          },
        });
      }

      if (players[3]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player4: null,
          },
        });
      }

      if (players[4]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player5: null,
          },
        });
      }

      if (players[5]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player6: null,
          },
        });
      }

      if (players[6]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player7: null,
          },
        });
      }

      if (players[7]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player8: null,
          },
        });
      }

      if (players[8]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player9: null,
          },
        });
      }

      if (players[9]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player10: null,
          },
        });
      }

      if (players[10]?.id === data.playerId) {
        await this.prisma.lineup.updateMany({
          where: {
            owner: data.ownerId,
          },
          data: {
            player11: null,
          },
        });
      }
    }

    return this.prisma.playerCardGenerated.update({
      where: {
        id: data.playerId,
      },
      data: {
        selling: true,
        price: data.price,
      },
    });
  }

  async buyCard(data: SellCard): Promise<GeneratedCard> {
    const updateOwner = await this.prisma.user.update({
      where: {
        id: data.ownerId,
      },
      data: {
        currency: { increment: data.price },
      },
    });

    const updateUser = await this.prisma.user.update({
      where: {
        id: data.newOwnerId,
      },
      data: {
        currency: { decrement: data.price },
      },
    });

    const updatedCard = await this.prisma.playerCardGenerated.update({
      where: {
        id: data.playerId,
      },
      data: {
        selling: false,
        owner: data.newOwnerId,
      },
    });

    return updatedCard;
  }

  // Open Rare Players Pack
  async openPlayersPack(data: OpenPackProps): Promise<any> {
    const user = await this.haveUserMoneySuficient(
      data.userId,
      35000,
      350,
      data.method,
    );

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [76, 77, 78, 79, 80, 81, 82, 83],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: data.userId,
          selling: false,
          playerId: card.id,
          name: card.name,
          club: card.club,
          league: card.league,
          type: card.type,
          position: card.position,
          overall: card.overall,
          pace: card.pace,
          finalization: card.finalization,
          pass: card.pass,
          drible: card.drible,
          defense: card.defense,
          physic: card.physic,
          minValue: card.minValue,
          maxValue: card.maxValue,
          quickSellValue: card.quickSellValue,
        }),
      );

      const generatedCards = await this.prisma.playerCardGenerated.createMany({
        data: GeneratedCard,
      });

      const allBadges = await this.getRandomBadges(2);
      const GeneratedBadge: GeneratedBadge[] = allBadges.map(
        (badge: Badge, index: number) => ({
          badgeId: badge.id,
          ownerId: data.userId,
          selling: false,
          badgeImage: badge.badgeImage,
          clubname: badge.clubname,
          maxValue: badge.maxValue,
          minValue: badge.minValue,
          quickSellValue: badge.quickSellValue,
        }),
      );

      const generatedBadge = await this.prisma.badgeCreated.createMany({
        data: GeneratedBadge,
      });

      return [...GeneratedCard, ...GeneratedBadge];
    } else {
      return 'Dinheiro insuficiente';
    }
  }

  // Open Rare Gold Pack
  async openRareGoldPack(data: OpenPackProps): Promise<any> {
    const user = await this.haveUserMoneySuficient(
      data.userId,
      10000,
      150,
      data.method,
    );

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [75, 76, 77, 78, 79, 80, 81],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: data.userId,
          selling: false,
          playerId: card.id,
          name: card.name,
          club: card.club,
          league: card.league,
          type: card.type,
          position: card.position,
          overall: card.overall,
          pace: card.pace,
          finalization: card.finalization,
          pass: card.pass,
          drible: card.drible,
          defense: card.defense,
          physic: card.physic,
          minValue: card.minValue,
          maxValue: card.maxValue,
          quickSellValue: card.quickSellValue,
        }),
      );

      const generatedCards = await this.prisma.playerCardGenerated.createMany({
        data: GeneratedCard,
      });

      const allBadges = await this.getRandomBadges(2);
      const GeneratedBadge: GeneratedBadge[] = allBadges.map(
        (badge: Badge, index: number) => ({
          badgeId: badge.id,
          ownerId: data.userId,
          selling: false,
          badgeImage: badge.badgeImage,
          clubname: badge.clubname,
          maxValue: badge.maxValue,
          minValue: badge.minValue,
          quickSellValue: badge.quickSellValue,
        }),
      );

      const generatedBadge = await this.prisma.badgeCreated.createMany({
        data: GeneratedBadge,
      });

      return [...GeneratedCard, ...GeneratedBadge];
    } else {
      return 'Dinheiro insuficiente';
    }
  }

  async openGoldPack(data: OpenPackProps): Promise<any> {
    const user = await this.haveUserMoneySuficient(
      data.userId,
      7500,
      100,
      data.method,
    );

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [74, 75, 76, 77, 78, 79, 80],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: data.userId,
          selling: false,
          playerId: card.id,
          name: card.name,
          club: card.club,
          league: card.league,
          type: card.type,
          position: card.position,
          overall: card.overall,
          pace: card.pace,
          finalization: card.finalization,
          pass: card.pass,
          drible: card.drible,
          defense: card.defense,
          physic: card.physic,
          minValue: card.minValue,
          maxValue: card.maxValue,
          quickSellValue: card.quickSellValue,
        }),
      );

      const generatedCards = await this.prisma.playerCardGenerated.createMany({
        data: GeneratedCard,
      });

      const allBadges = await this.getRandomBadges(2);
      const GeneratedBadge: GeneratedBadge[] = allBadges.map(
        (badge: Badge, index: number) => ({
          badgeId: badge.id,
          ownerId: data.userId,
          selling: false,
          badgeImage: badge.badgeImage,
          clubname: badge.clubname,
          maxValue: badge.maxValue,
          minValue: badge.minValue,
          quickSellValue: badge.quickSellValue,
        }),
      );

      const generatedBadge = await this.prisma.badgeCreated.createMany({
        data: GeneratedBadge,
      });

      return [...GeneratedCard, ...GeneratedBadge];
    } else {
      return 'Dinheiro insuficiente';
    }
  }

  async openRareSilverPack(data: OpenPackProps): Promise<any> {
    const user = await this.haveUserMoneySuficient(
      data.userId,
      5000,
      75,
      data.method,
    );

    if (user) {
      const AllCards = await this.getRandomCards(6, [68, 69, 70, 71, 72, 73]);
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: data.userId,
          selling: false,
          playerId: card.id,
          name: card.name,
          club: card.club,
          league: card.league,
          type: card.type,
          position: card.position,
          overall: card.overall,
          pace: card.pace,
          finalization: card.finalization,
          pass: card.pass,
          drible: card.drible,
          defense: card.defense,
          physic: card.physic,
          minValue: card.minValue,
          maxValue: card.maxValue,
          quickSellValue: card.quickSellValue,
        }),
      );

      const generatedCards = await this.prisma.playerCardGenerated.createMany({
        data: GeneratedCard,
      });

      const allBadges = await this.getRandomBadges(1);
      const GeneratedBadge: GeneratedBadge[] = allBadges.map(
        (badge: Badge, index: number) => ({
          badgeId: badge.id,
          ownerId: data.userId,
          selling: false,
          badgeImage: badge.badgeImage,
          clubname: badge.clubname,
          maxValue: badge.maxValue,
          minValue: badge.minValue,
          quickSellValue: badge.quickSellValue,
        }),
      );

      const generatedBadge = await this.prisma.badgeCreated.createMany({
        data: GeneratedBadge,
      });

      return [...GeneratedCard, ...GeneratedBadge];
    } else {
      return 'Dinheiro insuficiente';
    }
  }

  async openSilverPack(data: OpenPackProps): Promise<any> {
    const user = await this.haveUserMoneySuficient(
      data.userId,
      2500,
      50,
      data.method,
    );

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [65, 66, 67, 68, 69, 70, 71, 72, 72],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: data.userId,
          selling: false,
          playerId: card.id,
          name: card.name,
          club: card.club,
          league: card.league,
          type: card.type,
          position: card.position,
          overall: card.overall,
          pace: card.pace,
          finalization: card.finalization,
          pass: card.pass,
          drible: card.drible,
          defense: card.defense,
          physic: card.physic,
          minValue: card.minValue,
          maxValue: card.maxValue,
          quickSellValue: card.quickSellValue,
        }),
      );

      const generatedCards = await this.prisma.playerCardGenerated.createMany({
        data: GeneratedCard,
      });

      const allBadges = await this.getRandomBadges(1);
      const GeneratedBadge: GeneratedBadge[] = allBadges.map(
        (badge: Badge, index: number) => ({
          badgeId: badge.id,
          ownerId: data.userId,
          selling: false,
          badgeImage: badge.badgeImage,
          clubname: badge.clubname,
          maxValue: badge.maxValue,
          minValue: badge.minValue,
          quickSellValue: badge.quickSellValue,
        }),
      );

      const generatedBadge = await this.prisma.badgeCreated.createMany({
        data: GeneratedBadge,
      });

      return [...GeneratedCard, ...GeneratedBadge];
    } else {
      return 'Dinheiro insuficiente';
    }
  }

  async openBronzePack(data: OpenPackProps): Promise<any> {
    const user = await this.haveUserMoneySuficient(
      data.userId,
      500,
      25,
      data.method,
    );

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: data.userId,
          selling: false,
          playerId: card.id,
          name: card.name,
          club: card.club,
          league: card.league,
          type: card.type,
          position: card.position,
          overall: card.overall,
          pace: card.pace,
          finalization: card.finalization,
          pass: card.pass,
          drible: card.drible,
          defense: card.defense,
          physic: card.physic,
          minValue: card.minValue,
          maxValue: card.maxValue,
          quickSellValue: card.quickSellValue,
        }),
      );

      const generatedCards = await this.prisma.playerCardGenerated.createMany({
        data: GeneratedCard,
      });

      const allBadges = await this.getRandomBadges(1);
      const GeneratedBadge: GeneratedBadge[] = allBadges.map(
        (badge: Badge, index: number) => ({
          badgeId: badge.id,
          ownerId: data.userId,
          selling: false,
          badgeImage: badge.badgeImage,
          clubname: badge.clubname,
          maxValue: badge.maxValue,
          minValue: badge.minValue,
          quickSellValue: badge.quickSellValue,
        }),
      );

      const generatedBadge = await this.prisma.badgeCreated.createMany({
        data: GeneratedBadge,
      });

      return [...GeneratedCard, ...GeneratedBadge];
    } else {
      return 'Dinheiro insuficiente';
    }
  }

  async quickSellCard(quickSellCard: QuickSellProps): Promise<User> {
    await this.prisma.playerCardGenerated.delete({
      where: {
        id: quickSellCard.cardId,
      },
    });

    const user = await this.prisma.user.update({
      where: {
        id: quickSellCard.ownerId,
      },
      data: {
        currency: {
          increment: quickSellCard.price,
        },
      },
    });

    return user;
  }

  // Funções
  private async getRandomCards(count: number, overalls: number[]) {
    const allPossibleCards = await this.prisma.playerCard.findMany({
      where: {
        overall: {
          in: overalls,
        },
      },
    });
    const randomItems = (await this.shuffleArray(allPossibleCards)).slice(
      0,
      count,
    );
    return randomItems;
  }

  private async getRandomLeagueCards(
    count: number,
    overalls: number[],
    league: string,
  ) {
    const allPossibleCards = await this.prisma.playerCard.findMany({
      where: {
        overall: {
          in: overalls,
        },
        league: league,
      },
    });
    const randomItems = (await this.shuffleArray(allPossibleCards)).slice(
      0,
      count,
    );
    return randomItems;
  }

  private async getRandomBadges(count: number) {
    const allBadges = await this.prisma.badge.findMany();
    const randomBadges = (await this.shuffleArray(allBadges)).slice(0, count);
    return randomBadges;
  }

  // Embaralhamento das cartas
  private async shuffleArray(
    array: PlayerCardProps[] | any,
  ): Promise<PlayerCardProps[] | any> {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private async haveUserMoneySuficient(
    userId: string,
    coinsPackPrice: number,
    futpointsPackPrice: number,
    method: string,
  ) {
    // Buscar os dados do usuário para análise
    const userData = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (method === 'coins') {
      // Verificação se o usuário possui dinheiro suficiente
      if (userData.currency >= coinsPackPrice) {
        // Usuário tem dinheiro suficiente para comprar o pacote
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            // Descontar o valor do pacote da conta
            currency: {
              decrement: coinsPackPrice,
            },
          },
        });
        return userData;
      } else {
        // Usuário não te mdinheiro suficiente para comprar o pacote
        return null;
      }
    }

    if (method === 'fut-points') {
      // Verificação se o usuário possui dinheiro suficiente
      if (userData.futpoints >= futpointsPackPrice) {
        // Usuário tem dinheiro suficiente para comprar o pacote
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            // Descontar o valor do pacote da conta
            futpoints: {
              decrement: futpointsPackPrice,
            },
          },
        });
        return userData;
      } else {
        // Usuário não te mdinheiro suficiente para comprar o pacote
        return null;
      }
    }
  }

  async pickStarterTeam(data: PickStarterTeamProps): Promise<GeneratedCard[]> {
    if (data.userId) {
      const AllCards = await this.getRandomLeagueCards(
        11,
        [
          45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
          62, 63, 64,
        ],
        data.type,
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: data.userId,
          selling: false,
          playerId: card.id,
          name: card.name,
          club: card.club,
          league: card.league,
          type: card.type,
          position: card.position,
          overall: card.overall,
          pace: card.pace,
          finalization: card.finalization,
          pass: card.pass,
          drible: card.drible,
          defense: card.defense,
          physic: card.physic,
          minValue: card.minValue,
          maxValue: card.maxValue,
          quickSellValue: card.quickSellValue,
        }),
      );

      const generatedCards = await this.prisma.playerCardGenerated.createMany({
        data: GeneratedCard,
      });

      return GeneratedCard;
    }
  }

  finishClubSetup(data: ClubSetupProps): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        newUser: false,
        clubname: data.clubname,
      },
    });
  }
}
