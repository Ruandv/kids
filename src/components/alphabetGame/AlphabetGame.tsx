import React, { useState } from 'react';
import styles from './AlphabetGame.module.css';
import { useAppContext } from '../../context/AppContext';

const getRandomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z

const AlphabetGame: React.FC = () => {
    const [letter, setLetter] = useState(getRandomLetter());
    const [input, setInput] = useState('');
    const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
    const { setShowConfetti } = useAppContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value.toUpperCase());
        setResult(null);
        setShowConfetti(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input === letter) {
            setShowConfetti(true);
            setLetter(getRandomLetter());
            setInput('');
        } else {
            setResult('incorrect');
            setShowConfetti(false);
        }
    };

    return (
        <div className={styles.alphabetGameContainer}>
            <h2 className={styles.title}>Type the Letter</h2>
            <div className={styles.letterDisplay}>{letter}</div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    maxLength={1}
                    pattern="[A-Za-z]"
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

export default AlphabetGame;
