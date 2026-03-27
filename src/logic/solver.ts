import { ColorID, TubeData, Move } from '../types';
import { MAX_LAYERS } from '../constants';

/**
 * Normalizes the state by sorting tubes to avoid redundant pathfinding.
 * Empty tubes are moved to the end and sorted.
 */
function normalize(tubes: TubeData[]): string {
  return [...tubes]
    .map(t => t.join(','))
    .sort()
    .join('|');
}

function isComplete(tube: TubeData): boolean {
  if (tube.length === 0) return true;
  if (tube.length !== MAX_LAYERS) return false;
  const first = tube[0];
  return tube.every(c => c === first && c !== 'UNKNOWN');
}

function isGameWon(tubes: TubeData[]): boolean {
  return tubes.every(t => t.length === 0 || isComplete(t));
}

function canPour(from: TubeData, to: TubeData): { possible: boolean; count: number } {
  if (from.length === 0) return { possible: false, count: 0 };
  if (to.length === MAX_LAYERS) return { possible: false, count: 0 };

  const fromTop = from[from.length - 1];
  if (fromTop === 'UNKNOWN') return { possible: false, count: 0 };

  // Count how many of the same color are at the top of 'from'
  let count = 0;
  for (let i = from.length - 1; i >= 0; i--) {
    if (from[i] === fromTop) count++;
    else break;
  }

  // Check if 'to' can take it
  if (to.length === 0) {
    // Don't move a full stack of same color to an empty tube (useless move)
    if (count === from.length && from.length === MAX_LAYERS) return { possible: false, count: 0 };
    return { possible: true, count: Math.min(count, MAX_LAYERS - to.length) };
  }

  const toTop = to[to.length - 1];
  if (fromTop === toTop) {
    return { possible: true, count: Math.min(count, MAX_LAYERS - to.length) };
  }

  return { possible: false, count: 0 };
}

export function solve(initialTubes: TubeData[]): Move[] | null {
  // BFS for shortest path to win
  const queue: { tubes: TubeData[]; path: Move[] }[] = [{ tubes: initialTubes, path: [] }];
  const visited = new Set<string>();
  visited.add(normalize(initialTubes));

  let longestPath: Move[] = [];

  while (queue.length > 0) {
    const { tubes, path } = queue.shift()!;

    if (isGameWon(tubes)) return path;

    if (path.length > longestPath.length) {
      longestPath = path;
    }

    for (let i = 0; i < tubes.length; i++) {
      for (let j = 0; j < tubes.length; j++) {
        if (i === j) continue;

        const { possible, count } = canPour(tubes[i], tubes[j]);
        if (possible) {
          const newTubes = tubes.map(t => [...t]);
          const movingColor = newTubes[i][newTubes[i].length - 1];
          
          // Perform move
          for (let k = 0; k < count; k++) {
            newTubes[j].push(newTubes[i].pop()!);
          }

          // Check if UNKNOWN was revealed
          const revealedUnknown = newTubes[i].length > 0 && newTubes[i][newTubes[i].length - 1] === 'UNKNOWN';
          
          const move: Move = { from: i, to: j, color: movingColor, count, revealedUnknown };
          const newPath = [...path, move];

          // If UNKNOWN revealed, stop and return this path (Reveal Pause)
          if (revealedUnknown) return newPath;

          const stateKey = normalize(newTubes);
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push({ tubes: newTubes, path: newPath });
          }
        }
      }
    }
  }

  // If no win found, return longest path found (or null if no moves possible)
  return longestPath.length > 0 ? longestPath : null;
}
