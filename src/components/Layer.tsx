import React from 'react';
import { motion } from 'motion/react';
import { ICON_CONFIGS } from '../constants';
import { ColorID } from '../types';

interface LayerProps {
  colorId: ColorID;
  index: number;
  total: number;
  isMoving?: boolean;
}

export const Layer: React.FC<LayerProps> = ({ colorId, index, total, isMoving }) => {
  const config = ICON_CONFIGS[colorId];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute left-0 right-0 flex items-center justify-center border-t border-white/20"
      style={{
        bottom: `${(index / 4) * 100}%`,
        height: '25%',
        backgroundColor: config.color,
        zIndex: isMoving ? 50 : 10,
      }}
    >
      <Icon className="text-white drop-shadow-md" size={20} />
    </motion.div>
  );
};
