import { LucideIcon } from 'lucide-react';

export type ColorID = 
  | 'HEART' 
  | 'ZAP' 
  | 'CIRCLE' 
  | 'PLUS' 
  | 'TRIANGLE' 
  | 'SQUARE' 
  | 'MINUS' 
  | 'DROPLET' 
  | 'DIAMOND' 
  | 'STAR' 
  | 'UNKNOWN';

export interface IconConfig {
  icon: LucideIcon;
  color: string;
  label: string;
}

export type TubeData = ColorID[];

export interface Move {
  from: number;
  to: number;
  color: ColorID;
  count: number;
  revealedUnknown?: boolean;
}

export interface GameState {
  tubes: TubeData[];
  moves: Move[];
}
