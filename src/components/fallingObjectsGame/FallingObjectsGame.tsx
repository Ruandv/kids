import React, { useState, useRef, useEffect } from 'react';
import styles from './FallingObjectsGame.module.css';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 600; // px/s^2
const APPLE_SIZE = 48;
const SPAWN_INTERVAL = 1200; // ms
const MAX_LIVES = 3;

function getRandomX() {
  return Math.floor(Math.random() * (GAME_WIDTH - APPLE_SIZE));
}

interface Apple {
  id: number;
  x: number;
  y: number;
  velocity: number;
}

const FallingObjectsGame: React.FC = () => {
  const [apples, setApples] = useState<Apple[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(1);
  const lastTimeRef = useRef(performance.now());

  // Spawn apples
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setApples(apples => [
        ...apples,
        { id: nextId.current++, x: getRandomX(), y: 0, velocity: 0 }
      ]);
    }, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Game loop: gravity & position
  useEffect(() => {
    if (gameOver) return;
    function loop(now: number) {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setApples(apples => apples.map(apple => {
        let velocity = apple.velocity + GRAVITY * dt;
        let y = apple.y + velocity * dt;
        return { ...apple, velocity, y };
      }));
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    return () => {};
  }, [gameOver]);

  // Check for apples hitting the bottom
  useEffect(() => {
    if (gameOver) return;
    let missed = apples.filter(apple => apple.y + APPLE_SIZE >= GAME_HEIGHT);
    if (missed.length > 0) {
      setApples(apples => apples.filter(apple => apple.y + APPLE_SIZE < GAME_HEIGHT));
      setLives(l => {
        const newLives = l - missed.length;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
    }
  }, [apples, gameOver]);

  // Click to catch
  const handleCatch = (id: number) => {
    setApples(apples => apples.filter(apple => apple.id !== id));
    setScore(s => s + 1);
  };

  const handleRestart = () => {
    setApples([]);
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    nextId.current = 1;
    lastTimeRef.current = performance.now();
  };

  return (
    <div className={styles.fallingObjectsContainer} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
      <h2>Falling Objects Game</h2>
      <div className={styles.status}>Score: {score} | Lives: {lives}</div>
      {apples.map(apple => (
        <div
          key={apple.id}
          className={styles.apple}
          style={{ left: apple.x, top: apple.y, width: APPLE_SIZE, height: APPLE_SIZE }}
          onClick={() => handleCatch(apple.id)}
        >🍎</div>
      ))}
      {gameOver && (
        <div className={styles.gameOverMsg}>
          <div>Game Over!</div>
          <div>Score: {score}</div>
          <button className={styles.restartButton} onClick={handleRestart}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default FallingObjectsGame;
