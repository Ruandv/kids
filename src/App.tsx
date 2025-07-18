import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Menu, { GameOption } from './components/menu/Menu';
import styles from './App.module.css';

import NumbersGame from './components/numbersGame/NumbersGame';
import AlphabetGame from './components/alphabetGame/AlphabetGame';
import SpaceInvadersGame from './components/spaceInvadersGame/SpaceInvadersGame';
import TetrisGame from './components/tetrisGame/TetrisGame';
import FlappyBirdGame from './components/flappyBirdGame/FlappyBirdGame';
import TicTacToeGame from './components/ticTacToeGame/TicTacToeGame';
import Confetti from './components/confetti/Confetti';
import ClickerGame from './components/clickerGame/ClickerGame';

const AppContent: React.FC = () => {
  const { selectedGame, setSelectedGame, showConfetti } = useAppContext();

  const handleSelectGame = (key: string) => {
    setSelectedGame(key);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  let gameContent = null;
  switch (selectedGame) {
    case 'numbers':
      gameContent = (
        <>
          <NumbersGame />
          <button onClick={handleBackToMenu} style={{marginTop: 24, fontSize: '1.1rem', padding: '8px 24px', borderRadius: 8, background: 'linear-gradient(90deg, #43c6ac 0%, #f8ffae 100%)', color: '#2d3a4b', fontWeight: 600, cursor: 'pointer', border: 'none'}}>
            Back to Menu
          </button>
        </>
      );
      break;
    case 'alphabet':
      gameContent = (
        <>
          <AlphabetGame />
          <button onClick={handleBackToMenu} style={{marginTop: 24, fontSize: '1.1rem', padding: '8px 24px', borderRadius: 8, background: 'linear-gradient(90deg, #43c6ac 0%, #f8ffae 100%)', color: '#2d3a4b', fontWeight: 600, cursor: 'pointer', border: 'none'}}>
            Back to Menu
          </button>
        </>
      );
      break;
    case 'spaceinvaders':
      gameContent = (
        <>
          <SpaceInvadersGame />
          <button onClick={handleBackToMenu} style={{marginTop: 24, fontSize: '1.1rem', padding: '8px 24px', borderRadius: 8, background: 'linear-gradient(90deg, #43c6ac 0%, #f8ffae 100%)', color: '#2d3a4b', fontWeight: 600, cursor: 'pointer', border: 'none'}}>
            Back to Menu
          </button>
        </>
      );
      break;
    case 'tetris':
      gameContent = (
        <>
          <TetrisGame />
          <button onClick={handleBackToMenu} style={{marginTop: 24, fontSize: '1.1rem', padding: '8px 24px', borderRadius: 8, background: 'linear-gradient(90deg, #43c6ac 0%, #f8ffae 100%)', color: '#2d3a4b', fontWeight: 600, cursor: 'pointer', border: 'none'}}>
            Back to Menu
          </button>
        </>
      );
      break;
    case 'flappybird':
      gameContent = (
        <>
          <FlappyBirdGame />
          <button onClick={handleBackToMenu} style={{marginTop: 24, fontSize: '1.1rem', padding: '8px 24px', borderRadius: 8, background: 'linear-gradient(90deg, #43c6ac 0%, #f8ffae 100%)', color: '#2d3a4b', fontWeight: 600, cursor: 'pointer', border: 'none'}}>
            Back to Menu
          </button>
        </>
      );
      break;
    case 'tictactoe':
      gameContent = (
        <>
          <TicTacToeGame />
          <button onClick={handleBackToMenu} style={{marginTop: 24, fontSize: '1.1rem', padding: '8px 24px', borderRadius: 8, background: 'linear-gradient(90deg, #43c6ac 0%, #f8ffae 100%)', color: '#2d3a4b', fontWeight: 600, cursor: 'pointer', border: 'none'}}>
            Back to Menu
          </button>
        </>
      );
      break;
    case 'clicker':
      gameContent = (
        <>
          <ClickerGame />
          <button onClick={handleBackToMenu} style={{marginTop: 24, fontSize: '1.1rem', padding: '8px 24px', borderRadius: 8, background: 'linear-gradient(90deg, #43c6ac 0%, #f8ffae 100%)', color: '#2d3a4b', fontWeight: 600, cursor: 'pointer', border: 'none'}}>
            Back to Menu
          </button>
        </>
      );
      break;
    default:
      gameContent = <Menu onSelect={handleSelectGame} />;
      break;
  }

  return (
    <div className={styles.appContainer}>
      {gameContent}
      {showConfetti && <Confetti />}
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
