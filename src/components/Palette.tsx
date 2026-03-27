import React from 'react';
import { ColorID } from '../types';
import { COLOR_IDS, ICON_CONFIGS } from '../constants';
import { X } from 'lucide-react';

interface PaletteProps {
  onSelect: (colorId: ColorID | null) => void;
  onClose: () => void;
}

export const Palette: React.FC<PaletteProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Select Color/Icon</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {COLOR_IDS.map((id) => {
            const config = ICON_CONFIGS[id];
            const Icon = config.icon;
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-800 transition-all border border-transparent hover:border-gray-600"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: config.color }}
                >
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-xs text-gray-300 font-medium">{config.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => onSelect(null)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-900/20 transition-all border border-transparent hover:border-red-900/50"
          >
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600">
              <X className="text-red-500" size={24} />
            </div>
            <span className="text-xs text-red-400 font-medium">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};
