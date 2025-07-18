import React from 'react';
import styles from './Menu.module.css';

export type GameOption = {
  key: string;
  label: string;
};

const gameOptions: GameOption[] = [
  { key: 'numbers', label: 'Numbers Game' },
  { key: 'alphabet', label: 'Alphabet Game' },
  { key: 'spaceinvaders', label: 'Space Invaders Game' },
  { key: 'tetris', label: 'Tetris Game' },
  { key: 'flappybird', label: 'Flappy Bird Game' },
  { key: 'tictactoe', label: 'Tic Tac Toe Game' },
  { key: 'clicker', label: 'Clicker Game' },
];

interface MenuProps {
  onSelect: (key: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onSelect }) => {
  return (
    <div className={styles.menuContainer}>
      <h2 className={styles.menuTitle}>Select a Game</h2>
      <ul className={styles.menuList}>
        {gameOptions.map(option => (
          <li key={option.key}>
            <button className={styles.menuButton} onClick={() => onSelect(option.key)}>
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
