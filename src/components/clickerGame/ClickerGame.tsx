import React, { useRef, useState, useEffect } from 'react';
import styles from './ClickerGame.module.css';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BALL_SIZE = 48;
const GRAVITY = 400; // px/s^2
const BOUNCE_FORCE = 600; // px/s
const ENERGY_LOSS = 0.9;

const ClickerGame: React.FC = () => {
    const [y, setY] = useState(GAME_HEIGHT / 2);
    const [gameOver, setGameOver] = useState(false);
    const velocityRef = useRef(0);
    const yRef = useRef(GAME_HEIGHT / 2);
    const lastTimeRef = useRef(performance.now());

    // Game loop
    useEffect(() => {
        if (gameOver) return;
        let animationFrameId: number;
        function loop(now: number) {
            const dt = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;
            velocityRef.current += GRAVITY * dt;
            yRef.current += velocityRef.current * dt;
            setY(yRef.current);
            if (yRef.current + BALL_SIZE < GAME_HEIGHT) {
                animationFrameId = requestAnimationFrame(loop);
            }
        }
        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameOver]);

    // Game over check
    useEffect(() => {
        if (y + BALL_SIZE >= GAME_HEIGHT && !gameOver) {
            setGameOver(true);
        }
    }, [y, gameOver]);

    // Bounce logic
    const handleBounce = (e: React.MouseEvent<HTMLDivElement>) => {
        if (gameOver) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        // Ball top and bottom
        const ballTop = yRef.current;
        const ballBottom = yRef.current + BALL_SIZE;
        // If click is on the ball or below the ball, or if ball is at the bottom but game is not over yet
        if ((clickY >= ballTop && clickY <= ballBottom) || clickY > ballBottom || ballBottom >= GAME_HEIGHT) {
            velocityRef.current = -BOUNCE_FORCE * ENERGY_LOSS;
            // If ball is at the bottom, move it up a bit to avoid sticking
            if (ballBottom >= GAME_HEIGHT) {
                yRef.current = GAME_HEIGHT - BALL_SIZE - 1;
                setY(yRef.current);
            }
        }
    };

    const handleRestart = () => {
        setY(GAME_HEIGHT / 2);
        yRef.current = GAME_HEIGHT / 2;
        velocityRef.current = 0;
        setGameOver(false);
        lastTimeRef.current = performance.now();
    };

    return (
        <div
            className={styles.clickerGameContainer}
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            onClick={handleBounce}
        >
            <h2>Clicker Game</h2>
            <div className={styles.status}>{gameOver ? 'Game Over!' : 'Keep the ball up!'}</div>
            <div
                className={styles.ball}
                style={{ top: y, left: GAME_WIDTH / 2 - BALL_SIZE / 2, width: BALL_SIZE, height: BALL_SIZE }}
            >
                🟠
            </div>
            {gameOver && (
                <button className={styles.restartButton} onClick={handleRestart}>
                    Restart
                </button>
            )}
        </div>
    );
};

export default ClickerGame;
