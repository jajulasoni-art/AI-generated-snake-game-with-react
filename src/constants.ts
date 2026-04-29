import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 150;

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'AI Producer',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#ff00ff',
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'AI Beatmaker',
    cover: 'https://picsum.photos/seed/neon/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#00ffff',
  },
  {
    id: '3',
    title: 'Midnight Glitch',
    artist: 'AI Synth',
    cover: 'https://picsum.photos/seed/glitch/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#00ff00',
  },
];
