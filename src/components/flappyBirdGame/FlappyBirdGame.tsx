import React, { useEffect, useRef, useState } from 'react';
import styles from './FlappyBirdGame.module.css';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 40;
const GRAVITY = 900; // px/s^2
const JUMP_VELOCITY = -320; // px/s
const PIPE_WIDTH = 60;
const PIPE_GAP = 160;
const PIPE_INTERVAL = 1800; // ms
const PIPE_SPEED = 180; // px/s

function getRandomGapY() {
    return Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 80)) + 40;
}

// Pipe type
type Pipe = {
    x: number;
    gapY: number;
    scored?: boolean;
};

const FlappyBirdGame: React.FC = () => {
    const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
    const [birdV, setBirdV] = useState(0);
    const birdVRef = useRef(birdV);
    const [pipes, setPipes] = useState<Pipe[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    const lastTimeRef = useRef(performance.now());
    const gameRef = useRef<HTMLDivElement>(null);

    // Game loop
    useEffect(() => {
        birdVRef.current = birdV;
    }, [birdV]);

    useEffect(() => {
        if (gameOver || !started) return;
        let animationFrameId: number;
        function loop(now: number) {
            const dt = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;
            // Update bird velocity
            birdVRef.current = Math.min(birdVRef.current + GRAVITY * dt, 700);
            // Update bird position
            setBirdY(y => {
                let nextY = y + birdVRef.current * dt;
                if (nextY < 0) nextY = 0;
                if (nextY > GAME_HEIGHT - BIRD_SIZE) nextY = GAME_HEIGHT - BIRD_SIZE;
                return nextY;
            });
            setBirdV(birdVRef.current);
            setPipes(ps => ps.map(p => ({ ...p, x: p.x - PIPE_SPEED * dt }))); // move pipes
            animationFrameId = requestAnimationFrame(loop);
        }
        animationFrameId = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameOver, started]);

    // Pipe generation
    useEffect(() => {
        if (gameOver || !started) return;
        // Show first pipe immediately
        setPipes([{ x: GAME_WIDTH, gapY: getRandomGapY(), scored: false }]);
        const interval = setInterval(() => {
            setPipes(ps => [...ps, { x: GAME_WIDTH, gapY: getRandomGapY(), scored: false }]);
        }, PIPE_INTERVAL);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [gameOver, started]);

    // Remove off-screen pipes and update score
    useEffect(() => {
        setPipes(ps => ps.filter(p => p.x + PIPE_WIDTH > 0));
        pipes.forEach((p, i) => {
            if (!gameOver && p.x + PIPE_WIDTH < GAME_WIDTH / 2 - BIRD_SIZE / 2 && !p['scored']) {
                setScore(s => s + 1);
                p['scored'] = true;
            }
        });
    }, [pipes, gameOver]);

    // Collision detection
    useEffect(() => {
        if (gameOver || !started) return;
        // Bird hit ground or sky
        if (birdY + BIRD_SIZE > GAME_HEIGHT || birdY < 0) {
            setGameOver(true);
            setStarted(false);
            return;
        }
        // Bird hit pipe
        for (const p of pipes) {
            if (
                GAME_WIDTH / 2 - BIRD_SIZE / 2 + BIRD_SIZE > p.x &&
                GAME_WIDTH / 2 - BIRD_SIZE / 2 < p.x + PIPE_WIDTH
            ) {
                if (
                    birdY < p.gapY ||
                    birdY + BIRD_SIZE > p.gapY + PIPE_GAP
                ) {
                    setGameOver(true);
                    setStarted(false);
                    return;
                }
            }
        }
    }, [birdY, pipes, gameOver, started]);

    // Controls
    useEffect(() => {
        function jump(e: KeyboardEvent | MouseEvent) {
            if (gameOver) return;
            if (e instanceof KeyboardEvent) {
                if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    setStarted(true);
                    setBirdV(JUMP_VELOCITY);
                }
            } else {
                console.log('Mouse jump');
                setStarted(true);
                setBirdV(JUMP_VELOCITY);
            }
        }
        document.addEventListener('keydown', jump);
        window.addEventListener('mousedown', jump);
        return () => {
            document.removeEventListener('keydown', jump);
            window.removeEventListener('mousedown', jump);
        };
    }, [gameOver]);

    // Restart
    const handleRestart = () => {
        setBirdY(GAME_HEIGHT / 2);
        setBirdV(0);
        setPipes([]);
        setScore(0);
        setGameOver(false);
        setStarted(false);
        lastTimeRef.current = performance.now();
    };

    return (
        <div className={styles.flappyBirdContainer} ref={gameRef} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
            {/* Pipes */}
            {pipes.map((p, i) => (
                <>
                    <div key={i + 'top'} className={styles.pipe} style={{ left: p.x, height: p.gapY, top: 0 }} />
                    <div key={i + 'bottom'} className={styles.pipe} style={{ left: p.x, height: GAME_HEIGHT - p.gapY - PIPE_GAP, top: p.gapY + PIPE_GAP }} />
                </>
            ))}
            {/* Bird */}
            <div className={styles.bird} style={{ top: birdY, left: GAME_WIDTH / 2 - BIRD_SIZE / 2 }} />
            {/* Ground */}
            <div className={styles.ground} />
            {/* Score */}
            <div className={styles.score}>{score}</div>
            {/* Game Over */}
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

export default FlappyBirdGame;
