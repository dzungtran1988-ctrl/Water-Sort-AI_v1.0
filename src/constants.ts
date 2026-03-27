import { Heart, Zap, Circle, Plus, Triangle, Square, Minus, Droplet, Diamond, Star, HelpCircle } from 'lucide-react';
import { ColorID, IconConfig } from './types';

export const MAX_LAYERS = 4;
export const TOTAL_TUBES = 12;

export const ICON_CONFIGS: Record<ColorID, IconConfig> = {
  HEART: { icon: Heart, color: '#FF4D4D', label: 'Heart' },
  ZAP: { icon: Zap, color: '#FFD700', label: 'Zap' },
  CIRCLE: { icon: Circle, color: '#4D79FF', label: 'Circle' },
  PLUS: { icon: Plus, color: '#32CD32', label: 'Plus' },
  TRIANGLE: { icon: Triangle, color: '#FF8C00', label: 'Triangle' },
  SQUARE: { icon: Square, color: '#9370DB', label: 'Square' },
  MINUS: { icon: Minus, color: '#A9A9A9', label: 'Minus' },
  DROPLET: { icon: Droplet, color: '#00CED1', label: 'Droplet' },
  DIAMOND: { icon: Diamond, color: '#FF69B4', label: 'Diamond' },
  STAR: { icon: Star, color: '#F0E68C', label: 'Star' },
  UNKNOWN: { icon: HelpCircle, color: '#333333', label: 'Unknown' },
};

export const COLOR_IDS: ColorID[] = [
  'HEART', 'ZAP', 'CIRCLE', 'PLUS', 'TRIANGLE', 'SQUARE', 'MINUS', 'DROPLET', 'DIAMOND', 'STAR', 'UNKNOWN'
];
