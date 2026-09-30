import { createContext, useContext } from 'react';

export const GameContext = createContext(null);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider/GameWrapper');
  }
  return context;
};
