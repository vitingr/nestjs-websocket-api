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

  sellCard(data: SellCard): Promise<GeneratedCard> {
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
  async openPlayersPack(userId: string): Promise<any> {
    const user = await this.haveUserMoneySuficient(userId, 35000);

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [
          76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
          93, 94, 95, 96, 97, 98, 99,
        ],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: userId,
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
          ownerId: userId,
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
  async openRareGoldPack(userId: string): Promise<any> {
    const user = await this.haveUserMoneySuficient(userId, 10000);

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [75, 76, 77, 78, 79, 80, 81],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: userId,
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
          ownerId: userId,
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

  async openGoldPack(userId: string): Promise<any> {
    const user = await this.haveUserMoneySuficient(userId, 10000);

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [74, 75, 76, 77, 78, 79, 80],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: userId,
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
          ownerId: userId,
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

  async openRareSilverPack(userId: string): Promise<any> {
    const user = await this.haveUserMoneySuficient(userId, 10000);

    if (user) {
      const AllCards = await this.getRandomCards(6, [68, 69, 70, 71, 72, 73]);
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: userId,
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
          ownerId: userId,
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

      console.log(...GeneratedCard)

      return [...GeneratedCard, ...GeneratedBadge];
    } else {
      return 'Dinheiro insuficiente';
    }
  }

  async openSilverPack(userId: string): Promise<any> {
    const user = await this.haveUserMoneySuficient(userId, 10000);

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [65, 66, 67, 68, 69, 70, 71, 72, 72],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: userId,
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
          ownerId: userId,
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

  async openBronzePack(userId: string): Promise<any> {
    const user = await this.haveUserMoneySuficient(userId, 10000);

    if (user) {
      const AllCards = await this.getRandomCards(
        6,
        [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
      );
      const cardDrop = await this.shuffleArray(AllCards);

      const GeneratedCard: GeneratedCard[] = cardDrop.map(
        (card: Card, index: number) => ({
          cardImage: card.cardImage,
          owner: userId,
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
          ownerId: userId,
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

  private async haveUserMoneySuficient(userId: string, packPrice: number) {
    // Buscar os dados do usuário para análise
    const userData = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Verificação se o usuário possui dinheiro suficiente
    if (userData.currency >= packPrice) {
      // Usuário tem dinheiro suficiente para comprar o pacote
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          // Descontar o valor do pacote da conta
          currency: {
            decrement: packPrice,
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

// import { Injectable } from '@nestjs/common';
// import { CreateGeneratedCardInput } from './dto/create-generated-card.input';
// import { UpdateGeneratedCardInput } from './dto/update-generated-card.input';
// import { GeneratedCard } from './entities/generated-card.entity';
// import { PrismaService } from 'src/database/prisma.service';
// import { Card } from 'src/cards/entities/card.entity';
// import { SellCard } from './dto/sell-card';
// import { PlayerCardProps } from 'types';
// import { Badge } from '@prisma/client';

// @Injectable()
// export class GeneratedCardsService {
//   constructor(private prisma: PrismaService) {}

//   create(data: CreateGeneratedCardInput): Promise<GeneratedCard> {
//     const createdCard = this.prisma.playerCardGenerated.create({
//       data: data,
//     });
//     return createdCard;
//   }

//   findAll(): Promise<GeneratedCard[]> {
//     return this.prisma.playerCardGenerated.findMany();
//   }

//   findOne(id: string): Promise<GeneratedCard> {
//     return this.prisma.playerCardGenerated.findUnique({
//       where: {
//         id: id,
//       },
//     });
//   }

//   findUserCards(id: string): Promise<GeneratedCard[]> {
//     return this.prisma.playerCardGenerated.findMany({
//       where: {
//         owner: id,
//         selling: false,
//       },
//       orderBy: {
//         overall: 'desc',
//       },
//     });
//   }

//   getSellingCards(): Promise<GeneratedCard[]> {
//     return this.prisma.playerCardGenerated.findMany({
//       where: {
//         selling: true,
//       },
//     });
//   }

//   sellCard(data: SellCard): Promise<GeneratedCard> {
//     return this.prisma.playerCardGenerated.update({
//       where: {
//         id: data.playerId,
//       },
//       data: {
//         selling: true,
//         price: data.price,
//       },
//     });
//   }

//   async buyCard(data: SellCard): Promise<GeneratedCard> {
//     const updateOwner = await this.prisma.user.update({
//       where: {
//         id: data.ownerId,
//       },
//       data: {
//         currency: { increment: data.price },
//       },
//     });

//     const updateUser = await this.prisma.user.update({
//       where: {
//         id: data.newOwnerId,
//       },
//       data: {
//         currency: { decrement: data.price },
//       },
//     });

//     const updatedCard = await this.prisma.playerCardGenerated.update({
//       where: {
//         id: data.playerId,
//       },
//       data: {
//         selling: false,
//         owner: data.newOwnerId,
//       },
//     });

//     return updatedCard;
//   }

//   // Open Rare Players Pack
//   async openPlayersPack(userId: string): Promise<any> {

//     let result = []

//     const user = await this.haveUserMoneySuficient(userId, 35000);

//     if (user) {
//       const AllCards = await this.getRandomCards(
//         6,
//         [
//           76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
//           93, 94, 95, 96, 97, 98, 99,
//         ],
//       );
//       const cardDrop = await this.shuffleArray(AllCards);

//       const GeneratedCard = cardDrop.map((card: Card, index: number) => ({
//         cardImage: card.cardImage,
//         owner: userId,
//         selling: false,
//         playerId: card.id,
//         name: card.name,
//         club: card.club,
//         league: card.league,
//         type: card.type,
//         position: card.position,
//         overall: card.overall,
//         pace: card.pace,
//         finalization: card.finalization,
//         pass: card.pass,
//         drible: card.drible,
//         defense: card.defense,
//         physic: card.physic,
//         minValue: card.minValue,
//         maxValue: card.maxValue,
//         quickSellValue: card.quickSellValue,
//       }));

//       const generatedCards = await this.prisma.playerCardGenerated.createMany({
//         data: GeneratedCard,
//       });

//       const allBadges = await this.getRandomBadges(2);
//       const GeneratedBadge = allBadges.map((badge: Badge, index: number) => ({
//         badgeId: badge.id,
//         ownerId: userId,
//         selling: false,
//         badgeImage: badge.badgeImage,
//         clubname: badge.clubname,
//         maxValue: badge.maxValue,
//         minValue: badge.minValue,
//         quickSellValue: badge.quickSellValue
//       }))

//       const generatedBadge = await this.prisma.badgeCreated.createMany({
//         data: GeneratedBadge
//       })

//       result.push(GeneratedCard)
//       result.push(GeneratedBadge)
//       return result;
//     } else {
//       return 'Dinheiro insuficiente';
//     }
//   }

//   // Open Rare Gold Pack
//   async openRareGoldPack(userId: string): Promise<any> {

//     let result = []

//     const user = await this.haveUserMoneySuficient(userId, 10000);

//     if (user) {
//       const AllCards = await this.getRandomCards(
//         6,
//         [75, 76, 77, 78, 79, 80, 81],
//       );
//       const cardDrop = await this.shuffleArray(AllCards);

//       const GeneratedCard = cardDrop.map((card: Card, index: number) => ({
//         cardImage: card.cardImage,
//         owner: userId,
//         selling: false,
//         playerId: card.id,
//         name: card.name,
//         club: card.club,
//         league: card.league,
//         type: card.type,
//         position: card.position,
//         overall: card.overall,
//         pace: card.pace,
//         finalization: card.finalization,
//         pass: card.pass,
//         drible: card.drible,
//         defense: card.defense,
//         physic: card.physic,
//         minValue: card.minValue,
//         maxValue: card.maxValue,
//         quickSellValue: card.quickSellValue,
//       }));

//       const generatedCards = await this.prisma.playerCardGenerated.createMany({
//         data: GeneratedCard,
//       });

//       const allBadges = await this.getRandomBadges(2);
//       const GeneratedBadge = allBadges.map((badge: Badge, index: number) => ({
//         badgeId: badge.id,
//         ownerId: userId,
//         selling: false,
//         badgeImage: badge.badgeImage,
//         clubname: badge.clubname,
//         maxValue: badge.maxValue,
//         minValue: badge.minValue,
//         quickSellValue: badge.quickSellValue
//       }))

//       const generatedBadge = await this.prisma.badgeCreated.createMany({
//         data: GeneratedBadge
//       })

//       result.push(GeneratedCard)
//       result.push(GeneratedBadge)
//       return result;
//     } else {
//       return 'Dinheiro insuficiente';
//     }
//   }

//   async openGoldPack(userId: string): Promise<any> {

//     let result = []

//     const user = await this.haveUserMoneySuficient(userId, 7500);

//     if (user) {
//       const AllCards = await this.getRandomCards(
//         6,
//         [74, 75, 76, 77, 78, 79, 80],
//       );
//       const cardDrop = await this.shuffleArray(AllCards);

//       const GeneratedCard = cardDrop.map((card: Card, index: number) => ({
//         cardImage: card.cardImage,
//         owner: userId,
//         selling: false,
//         playerId: card.id,
//         name: card.name,
//         club: card.club,
//         league: card.league,
//         type: card.type,
//         position: card.position,
//         overall: card.overall,
//         pace: card.pace,
//         finalization: card.finalization,
//         pass: card.pass,
//         drible: card.drible,
//         defense: card.defense,
//         physic: card.physic,
//         minValue: card.minValue,
//         maxValue: card.maxValue,
//         quickSellValue: card.quickSellValue,
//       }));

//       const generatedCards = await this.prisma.playerCardGenerated.createMany({
//         data: GeneratedCard,
//       });

//       const allBadges = await this.getRandomBadges(2);
//       const GeneratedBadge = allBadges.map((badge: Badge, index: number) => ({
//         badgeId: badge.id,
//         ownerId: userId,
//         selling: false,
//         badgeImage: badge.badgeImage,
//         clubname: badge.clubname,
//         maxValue: badge.maxValue,
//         minValue: badge.minValue,
//         quickSellValue: badge.quickSellValue
//       }))

//       const generatedBadge = await this.prisma.badgeCreated.createMany({
//         data: GeneratedBadge
//       })

//       result.push(GeneratedCard)
//       result.push(GeneratedBadge)
//       return result;
//     } else {
//       return 'Dinheiro insuficiente';
//     }
//   }

//   async openRareSilverPack(userId: string): Promise<any> {

//     let result = []

//     const user = await this.haveUserMoneySuficient(userId, 5000);

//     if (user) {
//       const AllCards = await this.getRandomCards(6, [68, 69, 70, 71, 72, 73]);
//       const cardDrop = await this.shuffleArray(AllCards);

//       const GeneratedCard = cardDrop.map((card: Card, index: number) => ({
//         cardImage: card.cardImage,
//         owner: userId,
//         selling: false,
//         playerId: card.id,
//         name: card.name,
//         club: card.club,
//         league: card.league,
//         type: card.type,
//         position: card.position,
//         overall: card.overall,
//         pace: card.pace,
//         finalization: card.finalization,
//         pass: card.pass,
//         drible: card.drible,
//         defense: card.defense,
//         physic: card.physic,
//         minValue: card.minValue,
//         maxValue: card.maxValue,
//         quickSellValue: card.quickSellValue,
//       }));

//       const generatedCards = await this.prisma.playerCardGenerated.createMany({
//         data: GeneratedCard,
//       });

//       const allBadges = await this.getRandomBadges(1);
//       const GeneratedBadge = allBadges.map((badge: Badge, index: number) => ({
//         badgeId: badge.id,
//         ownerId: userId,
//         selling: false,
//         badgeImage: badge.badgeImage,
//         clubname: badge.clubname,
//         maxValue: badge.maxValue,
//         minValue: badge.minValue,
//         quickSellValue: badge.quickSellValue
//       }))

//       const generatedBadge = await this.prisma.badgeCreated.createMany({
//         data: GeneratedBadge
//       })

//       result.push(GeneratedCard)
//       result.push(GeneratedBadge)
//       return result;
//     } else {
//       return 'Dinheiro insuficiente';
//     }
//   }

//   async openSilverPack(userId: string): Promise<any> {

//     let result = []

//     const user = await this.haveUserMoneySuficient(userId, 2500);

//     if (user) {
//       const AllCards = await this.getRandomCards(
//         6,
//         [65, 66, 67, 68, 69, 70, 71, 72, 72],
//       );
//       const cardDrop = await this.shuffleArray(AllCards);

//       const GeneratedCard = cardDrop.map((card: Card, index: number) => ({
//         cardImage: card.cardImage,
//         owner: userId,
//         selling: false,
//         playerId: card.id,
//         name: card.name,
//         club: card.club,
//         league: card.league,
//         type: card.type,
//         position: card.position,
//         overall: card.overall,
//         pace: card.pace,
//         finalization: card.finalization,
//         pass: card.pass,
//         drible: card.drible,
//         defense: card.defense,
//         physic: card.physic,
//         minValue: card.minValue,
//         maxValue: card.maxValue,
//         quickSellValue: card.quickSellValue,
//       }));

//       const generatedCards = await this.prisma.playerCardGenerated.createMany({
//         data: GeneratedCard,
//       });

//       const allBadges = await this.getRandomBadges(1);
//       const GeneratedBadge = allBadges.map((badge: Badge, index: number) => ({
//         badgeId: badge.id,
//         ownerId: userId,
//         selling: false,
//         badgeImage: badge.badgeImage,
//         clubname: badge.clubname,
//         maxValue: badge.maxValue,
//         minValue: badge.minValue,
//         quickSellValue: badge.quickSellValue
//       }))

//       const generatedBadge = await this.prisma.badgeCreated.createMany({
//         data: GeneratedBadge
//       })

//       result.push(GeneratedCard)
//       result.push(GeneratedBadge)
//       return result;
//     } else {
//       return 'Dinheiro insuficiente';
//     }
//   }

//   async openBronzePack(userId: string): Promise<any> {

//     let result = []

//     const user = await this.haveUserMoneySuficient(userId, 500);

//     if (user) {
//       const AllCards = await this.getRandomCards(
//         6,
//         [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
//       );
//       const cardDrop = await this.shuffleArray(AllCards);

//       const GeneratedCard = cardDrop.map((card: Card, index: number) => ({
//         cardImage: card.cardImage,
//         owner: userId,
//         selling: false,
//         playerId: card.id,
//         name: card.name,
//         club: card.club,
//         league: card.league,
//         type: card.type,
//         position: card.position,
//         overall: card.overall,
//         pace: card.pace,
//         finalization: card.finalization,
//         pass: card.pass,
//         drible: card.drible,
//         defense: card.defense,
//         physic: card.physic,
//         minValue: card.minValue,
//         maxValue: card.maxValue,
//         quickSellValue: card.quickSellValue,
//       }));

//       const generatedCards = await this.prisma.playerCardGenerated.createMany({
//         data: GeneratedCard,
//       });

//       const allBadges = await this.getRandomBadges(1);
//       const GeneratedBadge = allBadges.map((badge: Badge, index: number) => ({
//         badgeId: badge.id,
//         ownerId: userId,
//         selling: false,
//         badgeImage: badge.badgeImage,
//         clubname: badge.clubname,
//         maxValue: badge.maxValue,
//         minValue: badge.minValue,
//         quickSellValue: badge.quickSellValue
//       }))

//       const generatedBadge = await this.prisma.badgeCreated.createMany({
//         data: GeneratedBadge
//       })

//       result.push(GeneratedCard)
//       result.push(GeneratedBadge)
//       return result;
//     } else {
//       return 'Dinheiro insuficiente';
//     }
//   }

//   // Funções
//   private async getRandomCards(count: number, overalls: number[]) {
//     const allPossibleCards = await this.prisma.playerCard.findMany({
//       where: {
//         overall: {
//           in: overalls,
//         },
//       },
//     });
//     const randomItems = (await this.shuffleArray(allPossibleCards)).slice(
//       0,
//       count,
//     );
//     return randomItems;
//   }

//   private async getRandomBadges(count: number) {
//     const allBadges = await this.prisma.badge.findMany();
//     const randomBadges = (await this.shuffleArray(allBadges)).slice(0, count);
//     return randomBadges;
//   }

//   // Embaralhamento das cartas
//   private async shuffleArray(
//     array: PlayerCardProps[] | any,
//   ): Promise<PlayerCardProps[] | any> {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }

//   private async haveUserMoneySuficient(userId: string, packPrice: number) {
//     // Buscar os dados do usuário para análise
//     const userData = await this.prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     // Verificação se o usuário possui dinheiro suficiente
//     if (userData.currency >= packPrice) {
//       // Usuário tem dinheiro suficiente para comprar o pacote
//       await this.prisma.user.update({
//         where: {
//           id: userId,
//         },
//         data: {
//           // Descontar o valor do pacote da conta
//           currency: {
//             decrement: packPrice,
//           },
//         },
//       });
//       return userData;
//     } else {
//       // Usuário não te mdinheiro suficiente para comprar o pacote
//       return null;
//     }
//   }
// }
