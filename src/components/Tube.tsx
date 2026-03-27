import React from 'react';
import { TubeData } from '../types';
import { Layer } from './Layer';
import { MAX_LAYERS } from '../constants';

interface TubeProps {
  data: TubeData;
  index: number;
  onSelect?: (index: number) => void;
  isSelected?: boolean;
  onCellClick?: (tubeIndex: number, cellIndex: number) => void;
}

export const Tube: React.FC<TubeProps> = ({ data, index, onSelect, isSelected, onCellClick }) => {
  return (
    <div 
      onClick={() => onSelect?.(index)}
      className={`relative w-16 h-48 border-4 rounded-b-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected ? 'border-yellow-400 scale-105 shadow-lg shadow-yellow-400/50' : 'border-gray-600 bg-gray-800/50'
      }`}
    >
      {/* Empty slots for clicking to edit */}
      {Array.from({ length: MAX_LAYERS }).map((_, i) => (
        <div 
          key={i}
          onClick={(e) => {
            if (onCellClick) {
              e.stopPropagation();
              onCellClick(index, i);
            }
          }}
          className="absolute left-0 right-0 h-1/4 z-20 hover:bg-white/10"
          style={{ bottom: `${(i / 4) * 100}%` }}
        />
      ))}

      {data.map((colorId, i) => (
        <Layer 
          key={`${index}-${i}-${colorId}`} 
          colorId={colorId} 
          index={i} 
          total={data.length} 
        />
      ))}
      
      <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-400 font-mono">
        {index + 1}
      </div>
    </div>
  );
};
