import { useState, useCallback } from 'react';
import { generateRandomLetters } from './utils/letterGenerator';
import { calculateScore, GameScore } from './utils/wordValidator';
import './App.css';

type Cell = string | null;
type Grid = Cell[][];

function App() {
  const [grid, setGrid] = useState<Grid>(() =>
    Array(5).fill(null).map(() => Array(5).fill(null))
  );
  const [availableLetters, setAvailableLetters] = useState<string[]>(() =>
    generateRandomLetters(3)
  );
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [score, setScore] = useState<GameScore>({
    total: 0,
    onePointWords: [],
    twoPointWords: [],
    fourPointWords: []
  });
  const [gameOver, setGameOver] = useState(false);

  const filledCells = grid.flat().filter(cell => cell !== null).length;
  const remainingCells = 25 - filledCells;

  const handleDragStart = (letter: string) => {
    setDraggedLetter(letter);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = useCallback((row: number, col: number) => {
    if (!draggedLetter || grid[row][col] !== null) return;

    // Place the letter
    const newGrid = grid.map((r, i) =>
      i === row ? r.map((c, j) => j === col ? draggedLetter : c) : [...r]
    );
    setGrid(newGrid);

    // Calculate new score
    const newScore = calculateScore(newGrid);
    setScore(newScore);

    // Check if game is over
    const newFilledCells = newGrid.flat().filter(cell => cell !== null).length;
    if (newFilledCells === 25) {
      setGameOver(true);
      setAvailableLetters([]);
    } else {
      // Generate new letters (excluding the one just used)
      setAvailableLetters(generateRandomLetters(3));
    }

    setDraggedLetter(null);
  }, [draggedLetter, grid]);

  const handleNewGame = () => {
    setGrid(Array(5).fill(null).map(() => Array(5).fill(null)));
    setAvailableLetters(generateRandomLetters(3));
    setScore({
      total: 0,
      onePointWords: [],
      twoPointWords: [],
      fourPointWords: []
    });
    setGameOver(false);
  };

  return (
    <div className="app">
      <h1>SelfCross</h1>

      <div className="score-display">
        <div className="score-value">Score: {score.total}</div>
        <div className="remaining-cells">Remaining: {remainingCells}</div>
      </div>

      <div className="game-board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${cell ? 'filled' : 'empty'}`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {!gameOver && (
        <div className="letter-selection">
          <p>Choose a letter:</p>
          <div className="available-letters">
            {availableLetters.map((letter, index) => (
              <div
                key={`${letter}-${index}`}
                className="letter-tile"
                draggable
                onDragStart={() => handleDragStart(letter)}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <div className="final-score">
            <h3>Final Score: {score.total}</h3>

            {score.fourPointWords.length > 0 && (
              <div className="word-category">
                <h4>4 points:</h4>
                <p>{score.fourPointWords.join(', ')}</p>
              </div>
            )}

            {score.twoPointWords.length > 0 && (
              <div className="word-category">
                <h4>2 points:</h4>
                <p>{score.twoPointWords.join(', ')}</p>
              </div>
            )}

            {score.onePointWords.length > 0 && (
              <div className="word-category">
                <h4>1 point:</h4>
                <p>{score.onePointWords.join(', ')}</p>
              </div>
            )}
          </div>

          <button className="new-game-btn" onClick={handleNewGame}>
            New Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
