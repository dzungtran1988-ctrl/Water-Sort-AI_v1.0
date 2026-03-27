import React from 'react';
import { Move } from '../types';
import { ArrowRight } from 'lucide-react';
import { ICON_CONFIGS } from '../constants';

interface LogPanelProps {
  moves: Move[];
  currentIndex: number;
}

export const LogPanel: React.FC<LogPanelProps> = ({ moves, currentIndex }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 h-64 overflow-y-auto font-mono text-sm">
      <h4 className="text-gray-500 uppercase tracking-widest text-xs mb-4 sticky top-0 bg-gray-900/90 py-1">Move History</h4>
      <div className="flex flex-col gap-2">
        {moves.length === 0 && <div className="text-gray-600 italic">No moves calculated yet...</div>}
        {moves.map((move, i) => {
          const config = ICON_CONFIGS[move.color];
          const isActive = i === currentIndex - 1;
          
          return (
            <div 
              key={i} 
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isActive ? 'bg-amber-500/20 border border-amber-500/30 text-amber-200' : 'text-gray-400'
              }`}
            >
              <span className="w-6 text-gray-600">{i + 1}.</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                <span>{config.label}</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="bg-gray-800 px-2 py-0.5 rounded">Tube {move.from + 1}</span>
                <ArrowRight size={14} />
                <span className="bg-gray-800 px-2 py-0.5 rounded">Tube {move.to + 1}</span>
              </div>
              {move.revealedUnknown && (
                <span className="text-[10px] bg-indigo-900/50 text-indigo-300 px-1.5 rounded border border-indigo-700/50">REVEAL!</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
