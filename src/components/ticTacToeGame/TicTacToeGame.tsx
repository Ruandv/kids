import React, { useState, useEffect } from 'react';
import styles from './TicTacToeGame.module.css';
import { useAppContext } from '../../context/AppContext';

const PLAYER = 'X';
const COMPUTER = 'O';
const EMPTY = '';

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: string[]): string | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board: string[]): boolean {
  return board.every(cell => cell !== EMPTY);
}

function getAvailableMoves(board: string[]): number[] {
  return board.map((cell, idx) => cell === EMPTY ? idx : -1).filter(idx => idx !== -1);
}

function computerMove(board: string[]): number {
  // Simple AI: pick random available move
  const moves = getAvailableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(EMPTY));
  const [turn, setTurn] = useState<'player' | 'computer'>('player');
  const winner = checkWinner(board);
  const isDraw = !winner && isBoardFull(board);
  const { setShowConfetti } = useAppContext();

  const handleCellClick = (idx: number) => {
    if (winner || board[idx] !== EMPTY || turn !== 'player') return;
    const newBoard = [...board];
    newBoard[idx] = PLAYER;
    setBoard(newBoard);
    setTurn('computer');
  };

  useEffect(() => {
    if (turn === 'computer' && !winner && !isDraw) {
      const move = computerMove(board);
      if (move !== undefined) {
        setTimeout(() => {
          const newBoard = [...board];
          newBoard[move] = COMPUTER;
          setBoard(newBoard);
          setTurn('player');
        }, 600); // delay for realism
      }
    }
  }, [turn, board, winner, isDraw]);

  useEffect(() => {
    if (winner === PLAYER) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [winner, setShowConfetti]);

  const renderCell = (idx: number) => (
    <button
      key={idx}
      className={styles.cell}
      onClick={() => handleCellClick(idx)}
      disabled={!!winner || board[idx] !== EMPTY || turn !== 'player'}
    >
      {board[idx]}
    </button>
  );

  let status = '';
  if (winner) {
    status = winner === PLAYER ? 'You win!' : 'Computer wins!';
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = turn === 'player' ? 'Your turn!' : "Computer's turn...";
  }

  const handleRestart = () => {
    setBoard(Array(9).fill(EMPTY));
    setTurn('player');
  };

  return (
    <div className={styles.ticTacToeContainer}>
      <h2>Tic Tac Toe</h2>
      <div className={styles.status}>{status}</div>
      <div className={styles.board}>
        {Array.from({ length: 9 }, (_, idx) => renderCell(idx))}
      </div>
      {(winner || isDraw) && (
        <button className={styles.restartButton} onClick={handleRestart}>
          Restart
        </button>
      )}
    </div>
  );
};

export default TicTacToeGame;
