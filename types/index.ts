export interface PlayerCardProps {
  id: string;
  cardImage: string;
  owner: string;
  selling: boolean;
  created: Date;
  price: number;
  playerId: string;
  name: string;
  club: string;
  league: string;
  overall: number;
  type: string;
  pace: number;
  finalization: number;
  pass: number;
  drible: number;
  defense: number;
  physic: number;
  maxValue: number;
  minValue: number;
  quickSellValue: number;
  position: string;
}