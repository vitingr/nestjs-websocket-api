import { GeneratedBadge } from "./generated-badge/entities/generated-badge.entity";
import { GeneratedCard } from "./generated-cards/entities/generated-card.entity";

export interface PlayerCardProps {
  id: string;
  cardImage: string;
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