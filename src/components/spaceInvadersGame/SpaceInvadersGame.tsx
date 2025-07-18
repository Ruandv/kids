import React, { useRef, useEffect, useState } from 'react';
import styles from './SpaceInvadersGame.module.css';
import { useAppContext } from '../../context/AppContext';

const INVADER_SIZE = 40;
const PLAYER_SIZE = 50;
const BULLET_SIZE = 8;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 800;
const INVADER_SPEED = 2;
const BULLET_SPEED = 6;
const INVADER_ROWS = 3;
const INVADER_COLS = 7;

function getInitialInvaders() {
    const invaders = [];
    for (let row = 0; row < INVADER_ROWS; row++) {
        for (let col = 0; col < INVADER_COLS; col++) {
            invaders.push({
                x: 60 + col * (INVADER_SIZE + 10),
                y: 40 + row * (INVADER_SIZE + 10),
                alive: true,
                id: `${row}-${col}`,
            });
        }
    }
    return invaders;
}

const SpaceInvadersGame: React.FC = () => {
    const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
    const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);
    const [invaders, setInvaders] = useState(getInitialInvaders());
    const [gameOver, setGameOver] = useState(false);
    const { setShowConfetti } = useAppContext();
    const gameRef = useRef<HTMLDivElement>(null);

    // Move player with mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!gameRef.current) return;
            const rect = gameRef.current.getBoundingClientRect();
            let x = e.clientX - rect.left - PLAYER_SIZE / 2;
            x = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, x));
            setPlayerX(x);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Shoot bullet on click
    const handleShoot = () => {
        setBullets(bullets => [...bullets, { x: playerX + PLAYER_SIZE / 2 - BULLET_SIZE / 2, y: GAME_HEIGHT - PLAYER_SIZE }]);
    };

    // Game loop
    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            // Move bullets
            setBullets(bullets => bullets.map(b => ({ ...b, y: b.y - BULLET_SPEED })).filter(b => b.y > 0));
            // Move invaders
            setInvaders(invaders => invaders.map(inv => ({ ...inv, y: inv.y + INVADER_SPEED })));
            // Check collisions
            setInvaders(invaders => {
                let updated = invaders.map(inv => {
                    if (!inv.alive) return inv;
                    for (const bullet of bullets) {
                        if (
                            bullet.x < inv.x + INVADER_SIZE &&
                            bullet.x + BULLET_SIZE > inv.x &&
                            bullet.y < inv.y + INVADER_SIZE &&
                            bullet.y + BULLET_SIZE > inv.y
                        ) {
                            return { ...inv, alive: false };
                        }
                    }
                    return inv;
                });
                // Win condition
                if (updated.every(inv => !inv.alive)) {
                    setGameOver(true);
                    setShowConfetti(true);
                }
                // Lose condition
                if (updated.some(inv => inv.y + INVADER_SIZE >= GAME_HEIGHT)) {
                    setGameOver(true);
                }
                return updated;
            });
        }, 60);
        return () => clearInterval(interval);
    }, [bullets, gameOver, setShowConfetti]);

    // Reset game
    const handleRestart = () => {
        setInvaders(getInitialInvaders());
        setBullets([]);
        setGameOver(false);
        setShowConfetti(false);
    };

    return (
        <div className={styles.spaceInvadersContainer} ref={gameRef} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }} onClick={handleShoot}>
            {/* Invaders */}
            {invaders.map(inv =>
                inv.alive ? (
                    <div key={inv.id} className={styles.invader} style={{ left: inv.x, top: inv.y }} />
                ) : null
            )}
            {/* Player */}
            <div className={styles.player} style={{ left: playerX, top: GAME_HEIGHT - PLAYER_SIZE }} />
            {/* Bullets */}
            {bullets.map((b, i) => (
                <div key={i} className={styles.bullet} style={{ left: b.x, top: b.y }} />
            ))}
            {/* Game Over Message */}
            {gameOver && (
                <div className={styles.gameOverMsg}>
                    {invaders.every(inv => !inv.alive) ? 'You Win! 🎉' : 'Game Over!'}
                    <button className={styles.restartButton} onClick={handleRestart}>Restart</button>
                </div>
            )}
        </div>
    );
};

export default SpaceInvadersGame;
