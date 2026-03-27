import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Camera, Brain, Wand2 } from 'lucide-react';

interface ControlPanelProps {
  onSolve: () => void;
  onAutoPlay: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
  onAnalyze: () => void;
  isAutoPlaying: boolean;
  canSolve: boolean;
  hasMoves: boolean;
  currentMoveIndex: number;
  totalMoves: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onSolve,
  onAutoPlay,
  onReset,
  onPrev,
  onNext,
  onAnalyze,
  isAutoPlaying,
  canSolve,
  hasMoves,
  currentMoveIndex,
  totalMoves,
}) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 p-6 rounded-3xl shadow-xl flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={onAnalyze}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Camera size={20} />
          AI Vision
        </button>

        <button
          onClick={onSolve}
          disabled={!canSolve}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
        >
          <Brain size={20} />
          Solve Puzzle
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      {hasMoves && (
        <div className="flex flex-col gap-4 items-center border-t border-gray-700 pt-6">
          <div className="flex items-center gap-6">
            <button
              onClick={onPrev}
              disabled={currentMoveIndex <= 0 || isAutoPlaying}
              className="p-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white rounded-full transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={onAutoPlay}
              className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-2xl font-black transition-all shadow-lg shadow-amber-500/30 active:scale-95"
            >
              {isAutoPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              {isAutoPlaying ? 'PAUSE' : 'AUTO PLAY'}
            </button>

            <button
              onClick={onNext}
              disabled={currentMoveIndex >= totalMoves || isAutoPlaying}
              className="p-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white rounded-full transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="text-sm font-mono text-gray-400">
            Step <span className="text-amber-400 font-bold">{currentMoveIndex}</span> / {totalMoves}
          </div>
        </div>
      )}
    </div>
  );
};
