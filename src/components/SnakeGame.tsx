import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { cn } from '../lib/utils';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setStatus('PLAYING');
    if (onScoreChange) onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    setSnake((prev) => {
      const head = prev[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE; break;
        case 'DOWN': newHead.y = (newHead.y + 1) % GRID_SIZE; break;
        case 'LEFT': newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE; break;
        case 'RIGHT': newHead.x = (newHead.x + 1) % GRID_SIZE; break;
      }

      // Check collision with self
      if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (onScoreChange) onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, onScoreChange]);

  useEffect(() => {
    if (status === 'PLAYING') {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': 
          if (status === 'PLAYING') setStatus('PAUSED');
          else if (status === 'PAUSED') setStatus('PLAYING');
          else if (status === 'IDLE' || status === 'GAME_OVER') resetGame();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[400px] px-4 py-2 glass rounded-xl">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-cyan" />
          <span className="font-mono text-xl font-bold neon-text-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-xs uppercase tracking-widest text-white/40 font-bold">
          {status}
        </div>
      </div>

      <div 
        className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-dark-surface neon-border rounded-lg overflow-hidden grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        <AnimatePresence>
          {status === 'IDLE' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <h2 className="text-3xl font-black mb-4 neon-text-pink tracking-tighter">NEON SNAKE</h2>
              <button 
                onClick={resetGame}
                className="group relative px-8 py-3 bg-neon-pink text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="relative z-10 flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  START GAME
                </div>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </button>
              <p className="mt-4 text-[10px] text-white/40 uppercase tracking-[4px]">Use Arrows or Space</p>
            </motion.div>
          )}

          {status === 'GAME_OVER' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
            >
              <h2 className="text-4xl font-black mb-2 text-red-500 tracking-tighter italic">GAME OVER</h2>
              <div className="text-6xl font-mono font-bold mb-6 neon-text-cyan">{score}</div>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-3 glass hover:bg-white/10 transition-colors rounded-full text-sm font-bold uppercase tracking-widest border-white/20"
              >
                <RotateCcw className="w-4 h-4" />
                TRY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Snake rendering */}
        {snake.map((segment, index) => (
          <div
            key={`${index}-${segment.x}-${segment.y}`}
            className={cn(
              "rounded-[2px] transition-all duration-100",
              index === 0 ? "bg-neon-cyan shadow-[0_0_10px_#00ffff]" : "bg-white/20"
            )}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food rendering */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-neon-pink rounded-full shadow-[0_0_15px_#ff00ff]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />
      </div>

      <div className="flex gap-4">
        {status === 'PLAYING' && (
          <button 
            onClick={() => setStatus('PAUSED')}
            className="p-4 glass rounded-full hover:bg-white/10 transition-colors"
          >
            <Pause className="w-6 h-6 text-white" />
          </button>
        )}
        {status === 'PAUSED' && (
          <button 
            onClick={() => setStatus('PLAYING')}
            className="p-4 glass rounded-full hover:bg-white/10 transition-colors"
          >
            <Play className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
