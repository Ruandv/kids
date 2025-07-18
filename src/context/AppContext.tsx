import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  selectedGame: string | null;
  setSelectedGame: (key: string | null) => void;
  showConfetti: boolean;
  setShowConfetti: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showVibrate, setShowVibrate] = useState(false);

  return (
    <AppContext.Provider value={{ selectedGame, setSelectedGame, showConfetti, setShowConfetti }}>
      {children}
    </AppContext.Provider>
  );
};
