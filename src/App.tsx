import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Music, Gamepad2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) setHighScore(score);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden selection:bg-neon-pink/30 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full" />
      </div>

      {/* Header Container */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-neon-pink to-neon-cyan rounded-xl">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              NEON<span className="text-neon-pink">BEATS</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">Arcade</a>
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">Mixer</a>
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">High Scores</a>
            </nav>
            <div className="h-4 w-px bg-white/10" />
            <div className="text-[10px] space-y-0.5">
              <div className="uppercase tracking-widest text-white/40 font-bold">Session Identity</div>
              <div className="text-neon-cyan font-mono">USER_BETA_2026</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Music Sidebar Info (Desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-neon-pink">
                <Music className="w-4 h-4" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Live Stream</h2>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Experience the synthwave aesthetic while you sharpen your reflexes. 
                Our AI-curated playlist adapts to your game tempo.
              </p>
            </section>

            <section className="p-6 glass rounded-2xl border-neon-pink/20 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Leaderboard</h3>
              <div className="space-y-3">
                {[
                  { name: "CYBER_WOLF", score: 2450 },
                  { name: "NEON_VIPER", score: 1820 },
                  { name: "GLITCH_CAT", score: 1540 }
                ].map((entry, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-mono text-white/40">#{i+1} {entry.name}</span>
                    <span className="font-mono text-neon-cyan font-bold">{entry.score}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Center Column: Game Area */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="mb-8 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 glass rounded-full border-neon-cyan/20">
                  <Gamepad2 className="w-3 h-3 text-neon-cyan" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan">Grid Protocol Active</span>
                </div>
              </div>
              
              <SnakeGame onScoreChange={handleScoreChange} />

              <div className="mt-8 text-center space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">Personal Best</div>
                <div className="text-2xl font-mono font-bold neon-text-pink">{highScore.toString().padStart(4, '0')}</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Music Player */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-[400px]"
            >
              <MusicPlayer />
            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-12">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            © 2026 NEONBEATS ARCADE SYSTEM // ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] text-white/40 uppercase tracking-widest hover:text-neon-cyan transition-colors">Privacy</a>
            <a href="#" className="text-[10px] text-white/40 uppercase tracking-widest hover:text-neon-cyan transition-colors">Terms</a>
            <a href="#" className="text-[10px] text-white/40 uppercase tracking-widest hover:text-neon-cyan transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
