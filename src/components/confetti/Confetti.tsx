import React, { useEffect, useRef } from 'react';
import styles from './Confetti.module.css';

const COLORS = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
const CONFETTI_COUNT = 40;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const Confetti: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const confetti = document.createElement('div');
      confetti.className = styles.confetti;
      confetti.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      confetti.style.left = `${randomBetween(0, 100)}%`;
      confetti.style.animationDelay = `${randomBetween(0, 1)}s`;
      confetti.style.width = `${randomBetween(8, 16)}px`;
      confetti.style.height = `${randomBetween(8, 16)}px`;
      container.appendChild(confetti);
    }
  }, []);

  return <div className={styles.confettiContainer} ref={containerRef} />;
};

export default Confetti;
