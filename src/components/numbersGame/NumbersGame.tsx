import React, { useState } from 'react';
import styles from './NumbersGame.module.css';
import { useAppContext } from '../../context/AppContext';

const getRandomNumber = () => Math.floor(Math.random() * 10);

const NumbersGame: React.FC = () => {
  const [number, setNumber] = useState(getRandomNumber());
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const { setShowConfetti } = useAppContext();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowConfetti(false);
    setResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === String(number)) {
      setShowConfetti(true);
      setNumber(getRandomNumber());
      setInput('');
      setResult(null);
    } else {
      setResult('incorrect');
      setShowConfetti(false);
    }
  };

  return (
    <div className={styles.numbersGameContainer}>
      <h2 className={styles.title}>Type the Number</h2>
      <div className={styles.numberDisplay}>{number}</div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          maxLength={1}
          pattern="[0-9]"
          value={input}
          onChange={handleChange}
          className={styles.input}
          autoFocus
        />
        <button type="submit" className={styles.submitButton}>Check</button>
      </form>
      {result === 'correct' && (
        <div className={styles.correct}>✅ Correct!</div>
      )}
      {result === 'incorrect' && (
        <div className={styles.incorrect}>❌ Try Again!</div>
      )}
    </div>
  );
};

export default NumbersGame;
