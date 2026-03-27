/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Tube } from './components/Tube';
import { ControlPanel } from './components/ControlPanel';
import { Palette } from './components/Palette';
import { LogPanel } from './components/LogPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { solve } from './logic/solver';
import { analyzeImage } from './services/gemini';
import { TubeData, ColorID, Move } from './types';
import { TOTAL_TUBES, MAX_LAYERS } from './constants';
import { Droplets, Sparkles, Info, AlertCircle } from 'lucide-react';

const INITIAL_TUBES: TubeData[] = Array.from({ length: TOTAL_TUBES }, () => []);

export default function App() {
  const [tubes, setTubes] = useState<TubeData[]>(INITIAL_TUBES);
  const [history, setHistory] = useState<TubeData[][]>([INITIAL_TUBES]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [editingCell, setEditingCell] = useState<{ tube: number; cell: number } | null>(null);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: 'Ready to solve'
  });

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Apply a move to the state
  const applyMove = useCallback((move: Move, direction: 'forward' | 'backward') => {
    setTubes(prev => {
      const newTubes = prev.map(t => [...t]);
      if (direction === 'forward') {
        for (let i = 0; i < move.count; i++) {
          const item = newTubes[move.from].pop();
          if (item) newTubes[move.to].push(item);
        }
      } else {
        for (let i = 0; i < move.count; i++) {
          const item = newTubes[move.to].pop();
          if (item) newTubes[move.from].push(item);
        }
      }
      return newTubes;
    });
  }, []);

  // Handle Auto-play logic
  useEffect(() => {
    if (isAutoPlaying && currentMoveIndex < moves.length) {
      autoPlayTimerRef.current = setTimeout(() => {
        const move = moves[currentMoveIndex];
        applyMove(move, 'forward');
        setCurrentMoveIndex(prev => prev + 1);
        
        if (move.revealedUnknown) {
          setIsAutoPlaying(false);
          setStatus({ type: 'success', message: 'Unknown revealed! Please update the puzzle state.' });
        }
      }, 800);
    } else if (currentMoveIndex >= moves.length) {
      setIsAutoPlaying(false);
    }

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, currentMoveIndex, moves, applyMove]);

  const handleSolve = () => {
    setStatus({ type: 'loading', message: 'Calculating optimal solution...' });
    
    // Small delay to allow UI to show loading
    setTimeout(() => {
      const solution = solve(tubes);
      if (solution) {
        setMoves(solution);
        setCurrentMoveIndex(0);
        setStatus({ type: 'success', message: `Found solution with ${solution.length} steps!` });
      } else {
        setStatus({ type: 'error', message: 'No solution found for this state.' });
      }
    }, 100);
  };

  const handleAnalyze = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setStatus({ type: 'loading', message: 'AI is analyzing the image...' });
      
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const result = await analyzeImage(base64);
        if (result) {
          setTubes(result);
          setHistory([result]);
          setMoves([]);
          setCurrentMoveIndex(0);
          setStatus({ type: 'success', message: 'Puzzle state imported successfully!' });
        } else {
          setStatus({ type: 'error', message: 'AI failed to recognize the puzzle. Try a clearer photo.' });
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleReset = () => {
    setTubes(INITIAL_TUBES);
    setHistory([INITIAL_TUBES]);
    setMoves([]);
    setCurrentMoveIndex(0);
    setIsAutoPlaying(false);
    setStatus({ type: 'idle', message: 'Puzzle reset' });
  };

  const handleNext = () => {
    if (currentMoveIndex < moves.length) {
      applyMove(moves[currentMoveIndex], 'forward');
      setCurrentMoveIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentMoveIndex > 0) {
      applyMove(moves[currentMoveIndex - 1], 'backward');
      setCurrentMoveIndex(prev => prev - 1);
    }
  };

  const handleCellClick = (tubeIndex: number, cellIndex: number) => {
    setEditingCell({ tube: tubeIndex, cell: cellIndex });
  };

  const handlePaletteSelect = (colorId: ColorID | null) => {
    if (editingCell) {
      setTubes(prev => {
        const newTubes = prev.map(t => [...t]);
        const tube = newTubes[editingCell.tube];
        
        if (colorId === null) {
          // Remove item at this index and above
          newTubes[editingCell.tube] = tube.slice(0, editingCell.cell);
        } else {
          // Set item at this index
          if (editingCell.cell < MAX_LAYERS) {
            tube[editingCell.cell] = colorId;
          }
        }
        return newTubes;
      });
      setEditingCell(null);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-amber-500/30">
        {/* Header */}
        <header className="p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-500/20">
                <Droplets className="text-gray-900" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                  WATER SORT <span className="text-amber-500">AI</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Vision + Auto-Solver v1.0</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              status.type === 'loading' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 animate-pulse' :
              status.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
              status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              'bg-gray-800/50 border-gray-700 text-gray-400'
            }`}>
              {status.type === 'loading' && <Sparkles size={16} className="animate-spin" />}
              {status.type === 'error' && <AlertCircle size={16} />}
              {status.type === 'success' && <Sparkles size={16} />}
              {status.type === 'idle' && <Info size={16} />}
              {status.message}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Game Board */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-x-4 gap-y-12 justify-items-center bg-gray-900/30 p-12 rounded-[3rem] border border-gray-800/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f59e0b,transparent_70%)]" />
              </div>
              
              {tubes.map((tube, i) => (
                <Tube 
                  key={i} 
                  data={tube} 
                  index={i} 
                  onCellClick={handleCellClick}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/40 p-6 rounded-3xl border border-gray-800">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info size={14} /> Instructions
                </h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex gap-2"><span className="text-amber-500 font-bold">1.</span> Upload a screenshot of your game using AI Vision.</li>
                  <li className="flex gap-2"><span className="text-amber-500 font-bold">2.</span> Manually fix any errors by clicking on the tube cells.</li>
                  <li className="flex gap-2"><span className="text-amber-500 font-bold">3.</span> Click "Solve" to find the path.</li>
                  <li className="flex gap-2"><span className="text-amber-500 font-bold">4.</span> Use "Auto Play" to watch the solution.</li>
                </ul>
              </div>
              
              <LogPanel moves={moves} currentIndex={currentMoveIndex} />
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <ControlPanel 
                onSolve={handleSolve}
                onAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
                onReset={handleReset}
                onPrev={handlePrev}
                onNext={handleNext}
                onAnalyze={handleAnalyze}
                isAutoPlaying={isAutoPlaying}
                canSolve={tubes.some(t => t.length > 0)}
                hasMoves={moves.length > 0}
                currentMoveIndex={currentMoveIndex}
                totalMoves={moves.length}
              />
              
              <div className="mt-8 p-6 bg-indigo-900/20 border border-indigo-500/20 rounded-3xl">
                <h4 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                  <Sparkles size={18} /> Pro Tip
                </h4>
                <p className="text-sm text-indigo-200/60 leading-relaxed">
                  The solver uses a hybrid BFS/DFS algorithm. If it can't find a direct win, it will prioritize moves that reveal <span className="text-indigo-300 font-bold">UNKNOWN</span> cells.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        <AnimatePresence>
          {editingCell && (
            <Palette 
              onSelect={handlePaletteSelect} 
              onClose={() => setEditingCell(null)} 
            />
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="p-12 text-center border-t border-gray-900">
          <p className="text-gray-600 text-xs font-mono uppercase tracking-[0.3em]">
            Built with Google Gemini 1.5 Flash & Framer Motion
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
