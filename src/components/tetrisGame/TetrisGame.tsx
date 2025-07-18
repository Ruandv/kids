import React, { useEffect, useState } from 'react';
import styles from './TetrisGame.module.css';
import { useAppContext } from '../../context/AppContext';

// Board dimensions
const COLS = 10;
const ROWS = 20;

// Tetromino shapes and rotations
const TETROMINOES = {
    I: [
        [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
    ],
    J: [
        [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
        [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
        [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
    ],
    L: [
        [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
        [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
        [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
    ],
    O: [
        [[1, 1], [1, 1]]
    ],
    S: [
        [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 1], [0, 0, 1]]
    ],
    T: [
        [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
        [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
        [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
    ],
    Z: [
        [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
        [[0, 0, 1], [0, 1, 1], [0, 1, 0]]
    ]
};

const COLORS = {
    I: '#00f0f0', J: '#0000f0', L: '#f0a000', O: '#f0f000', S: '#00f000', T: '#a000f0', Z: '#f00000'
};

function getRandomTetromino() {
    const keys = Object.keys(TETROMINOES);
    const type = keys[Math.floor(Math.random() * keys.length)];
    return { type, rotation: 0, shape: TETROMINOES[type][0], x: Math.floor(COLS / 2) - 1, y: 0 };
}

function checkCollision(board, tetromino, dx, dy, rotation) {
    const shape = TETROMINOES[tetromino.type][rotation];
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const newX = tetromino.x + x + dx;
                const newY = tetromino.y + y + dy;
                if (
                    newX < 0 || newX >= COLS ||
                    newY >= ROWS ||
                    (newY >= 0 && board[newY][newX])
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function placeTetromino(board, tetromino) {
    const shape = TETROMINOES[tetromino.type][tetromino.rotation];
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const px = tetromino.x + x;
                const py = tetromino.y + y;
                if (py >= 0 && py < ROWS && px >= 0 && px < COLS) {
                    newBoard[py][px] = tetromino.type;
                }
            }
        }
    }
    return newBoard;
}

function clearLines(board) {
    let lines = 0;
    const newBoard = board.filter(row => {
        if (row.every(cell => cell)) {
            lines++;
            return false;
        }
        return true;
    });
    while (newBoard.length < ROWS) {
        newBoard.unshift(Array(COLS).fill(0));
    }
    return { newBoard, lines };
}

const TetrisGame: React.FC = () => {
    const [board, setBoard] = useState(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
    const [tetromino, setTetromino] = useState(getRandomTetromino());
    const [nextTetromino, setNextTetromino] = useState(getRandomTetromino());
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [linesCleared, setLinesCleared] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [dropInterval, setDropInterval] = useState(700);
    const { setShowConfetti } = useAppContext();

    // Game loop: drop piece
    useEffect(() => {
        if (gameOver) return;
        const timer = setInterval(() => {
            moveTetromino(0, 1);
        }, dropInterval);
        return () => clearInterval(timer);
    });

    // Keyboard controls
    useEffect(() => {
        if (gameOver) return;
        const handleKey = (e: KeyboardEvent) => {
            e.preventDefault(); // Prevent default browser actions
            if (e.key === 'ArrowLeft') moveTetromino(-1, 0);
            if (e.key === 'ArrowRight') moveTetromino(1, 0);
            if (e.key === 'ArrowDown') moveTetromino(0, 1);
            if (e.key === 'ArrowUp') rotateTetromino(1);
            if (e.key === 'z' || e.key === 'Z') rotateTetromino(-1);
            if (e.key === ' ') hardDrop();
            if (e.key === 'p' || e.key === 'P') setGameOver(true); // Pause
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });

    function moveTetromino(dx, dy) {
        if (!checkCollision(board, tetromino, dx, dy, tetromino.rotation)) {
            setTetromino(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
        } else if (dy === 1) {
            // Piece locked
            const newBoard = placeTetromino(board, tetromino);
            const { newBoard: clearedBoard, lines } = clearLines(newBoard);
            setBoard(clearedBoard);
            setScore(s => s + [0, 100, 300, 500, 800][lines]);
            setLinesCleared(l => l + lines);
            setLevel(l => Math.floor((l + lines) / 10) + 1);
            setDropInterval(700 - (level - 1) * 50);
            if (lines > 0) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 1200);
            }
            // Spawn next piece
            if (checkCollision(clearedBoard, nextTetromino, 0, 0, nextTetromino.rotation)) {
                setGameOver(true);
            } else {
                setTetromino(nextTetromino);
                setNextTetromino(getRandomTetromino());
            }
        }
    }

    function rotateTetromino(dir) {
        let newRotation = (tetromino.rotation + dir + TETROMINOES[tetromino.type].length) % TETROMINOES[tetromino.type].length;
        if (!checkCollision(board, tetromino, 0, 0, newRotation)) {
            setTetromino(t => ({ ...t, rotation: newRotation }));
        }
    }

    function hardDrop() {
        let dy = 0;
        while (!checkCollision(board, tetromino, 0, dy + 1, tetromino.rotation)) {
            dy++;
        }
        setTetromino(t => ({ ...t, y: t.y + dy }));
        moveTetromino(0, dy + 1); // lock
    }

    function restartGame() {
        setBoard(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
        setTetromino(getRandomTetromino());
        setNextTetromino(getRandomTetromino());
        setScore(0);
        setLevel(1);
        setLinesCleared(0);
        setGameOver(false);
        setDropInterval(700);
    }

    // Render board with current piece
    function renderBoard() {
        const display = board.map(row => [...row]);
        const shape = TETROMINOES[tetromino.type][tetromino.rotation];
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const px = tetromino.x + x;
                    const py = tetromino.y + y;
                    if (py >= 0 && py < ROWS && px >= 0 && px < COLS) {
                        display[py][px] = tetromino.type;
                    }
                }
            }
        }
        return display;
    }

    return (
        <div className={styles.tetrisGameContainer}>
            <h2 className={styles.title}>Tetris Game</h2>
            <div className={styles.infoPanel}>
                <div>Score: {score}</div>
                <div>Level: {level}</div>
                <div>Lines: {linesCleared}</div>
                <div>Next:
                    <div className={styles.nextPiece}>
                        {TETROMINOES[nextTetromino.type][nextTetromino.rotation].map((row, y) => (
                            <div key={y} style={{ display: 'flex' }}>
                                {row.map((cell, x) => (
                                    <div key={x} style={{ width: 16, height: 16, background: cell ? COLORS[nextTetromino.type] : '#eee', border: '1px solid #ccc' }} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.board}>
                {renderBoard().map((row, y) => (
                    <div key={y} className={styles.row}>
                        {row.map((cell, x) => (
                            <div key={x} className={styles.cell} style={{ background: cell ? COLORS[cell] : '#fff' }} />
                        ))}
                    </div>
                ))}
            </div>
            {gameOver && (
                <div className={styles.gameOverMsg}>
                    <div>Game Over!</div>
                    <button className={styles.restartButton} onClick={restartGame}>Restart</button>
                </div>
            )}
            <div className={styles.controls}>
                <div>Controls:</div>
                <ul>
                    <li>← → ↓ : Move</li>
                    <li>↑ / Z : Rotate</li>
                    <li>Space : Hard Drop</li>
                    <li>P : Pause</li>
                </ul>
            </div>
        </div>
    );
};

export default TetrisGame;
