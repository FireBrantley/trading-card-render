export interface AttackInfo {
  name: string;
  energyCost: string[];
  damage: number | string;
  description: string;
}

export interface CardCombatMatrix {
  weakness: { element: string; multiplier: string };
  resistance: { element: string; value: string };
  retreatCost: number;
}

export interface TradingCardProps {
  schemaVersion?: number;
  id?: string;
  name?: string;
  emoji?: string;
  hp?: number;
  stageBadge?: string;
  evolutionNote?: string;
  cardNumber?: string;
  elementEmoji?: string;
  colorStart?: string;
  colorEnd?: string;
  cardColor?: string;
  showGrid?: boolean;
  showCornerBrackets?: boolean;
  showCombatMatrix?: boolean;
  ability?: {
    name: string;
    description: string;
  } | null;
  attacks?: AttackInfo[];
  combatMatrix?: CardCombatMatrix | null;
  className?: string;
  style?: React.CSSProperties;
}
