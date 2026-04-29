import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ListMusic } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
      />

      <div className="relative group">
        <div className="aspect-square rounded-2xl overflow-hidden neon-border">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div 
            key={currentTrack.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-1"
          >
            <h3 className="text-xl font-bold tracking-tight">{currentTrack.title}</h3>
            <p className="text-white/60 text-sm">{currentTrack.artist}</p>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer">
            <motion.div 
              className="h-full bg-neon-pink"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={prevTrack}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 translate-x-0.5" />}
            </button>
            <button 
              onClick={nextTrack}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-white/40">
            <Volume2 className="w-5 h-5" />
            <ListMusic className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Playlist Preview */}
      <div className="flex flex-col gap-2">
        {TRACKS.map((track, index) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              if (!isPlaying) setIsPlaying(true);
            }}
            className={cn(
              "flex items-center gap-4 p-3 rounded-xl transition-all",
              currentTrackIndex === index ? "bg-white/10" : "hover:bg-white/5 opacity-60"
            )}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img src={track.cover} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col items-start overflow-hidden">
              <span className={cn("text-sm font-bold truncate w-full", currentTrackIndex === index && "text-neon-pink")}>
                {track.title}
              </span>
              <span className="text-xs text-white/40 truncate w-full">{track.artist}</span>
            </div>
            {currentTrackIndex === index && isPlaying && (
              <div className="ml-auto flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-0.5 bg-neon-pink"
                  />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
