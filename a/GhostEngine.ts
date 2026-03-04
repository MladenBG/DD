// GhostEngine.ts
import { STICKERS } from './profilesData';

export interface GhostMessage {
  id: string;
  user: string;
  text: string;
  isSticker: boolean;
  time: string;
}

const getNextDelay = (): number => {
  const min = 30 * 60 * 1000; // 30 mins
  const max = 120 * 60 * 1000; // 2 hours
  
  // For quick testing, use: return 5000; (5 seconds)
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const startGhostLogic = (onNewMessage: (msg: GhostMessage) => void) => {
  const runCycle = () => {
    const delay = getNextDelay();
    
    setTimeout(() => {
      const fakeMsg: GhostMessage = {
        id: Date.now().toString(),
        user: ["Sofija", "Emma", "Valentina"][Math.floor(Math.random() * 3)],
        text: STICKERS[Math.floor(Math.random() * STICKERS.length)],
        isSticker: true,
        time: "Just Now",
      };

      onNewMessage(fakeMsg);
      runCycle(); 
    }, delay);
  };

  runCycle();
};