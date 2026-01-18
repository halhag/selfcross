import { useState, useCallback } from 'react';
import { generateRandomLetters } from './utils/letterGenerator';
import { calculateScore, GameScore } from './utils/wordValidator';
import './App.css';

type Cell = string | null;
type Grid = Cell[][];

interface RankingLevel {
  level: number;
  name: string;
  description: string;
  minScore: number;
  maxScore: number | null;
}

const RANKING_LEVELS: RankingLevel[] = [
  { level: 1, name: "Beginner", description: "Learning the game, few valid words", minScore: 0, maxScore: 15 },
  { level: 2, name: "Novice", description: "Getting the hang of it, some planning ahead", minScore: 16, maxScore: 25 },
  { level: 3, name: "Intermediate", description: "Decent word formation, strategic placement", minScore: 26, maxScore: 35 },
  { level: 4, name: "Advanced", description: "Strong vocabulary usage, good spatial planning", minScore: 36, maxScore: 50 },
  { level: 5, name: "Expert", description: "Excellent word management, maximizing overlaps", minScore: 51, maxScore: 70 },
  { level: 6, name: "Master", description: "Exceptional performance, rare to achieve", minScore: 71, maxScore: null }
];

const getRanking = (score: number): RankingLevel => {
  for (const level of RANKING_LEVELS) {
    if (level.maxScore === null) {
      if (score >= level.minScore) return level;
    } else {
      if (score >= level.minScore && score <= level.maxScore) return level;
    }
  }
  return RANKING_LEVELS[0];
};

function App() {
  const [grid, setGrid] = useState<Grid>(() =>
    Array(5).fill(null).map(() => Array(5).fill(null))
  );
  const [availableLetters, setAvailableLetters] = useState<string[]>(() =>
    generateRandomLetters(3)
  );
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [score, setScore] = useState<GameScore>({
    total: 0,
    onePointWords: [],
    twoPointWords: [],
    fourPointWords: []
  });
  const [gameOver, setGameOver] = useState(false);

  const handleDragStart = (letter: string) => {
    setDraggedLetter(letter);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
  };

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!selectedLetter || grid[row][col] !== null) return;

    // Place the letter
    const newGrid = grid.map((r, i) =>
      i === row ? r.map((c, j) => j === col ? selectedLetter : c) : [...r]
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
      // Generate new letters
      setAvailableLetters(generateRandomLetters(3));
    }

    setSelectedLetter(null);
  }, [selectedLetter, grid]);

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
      </div>

      <div className="game-board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${cell ? 'filled' : 'empty'} ${selectedLetter && !cell ? 'clickable' : ''}`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
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
                className={`letter-tile ${selectedLetter === letter ? 'selected' : ''}`}
                draggable
                onDragStart={() => handleDragStart(letter)}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameOver && (
        <>
          <button className="new-game-btn" onClick={handleNewGame}>
            New Game
          </button>

          <div className="game-over">
            <h2>Game Over!</h2>

            {(() => {
              const ranking = getRanking(score.total);
              return (
                <div className="ranking-display">
                  <h3 className="ranking-title">
                    Level {ranking.level} of 6: {ranking.name}
                  </h3>
                  <p className="ranking-score">{score.total} points</p>
                  <p className="ranking-description">({ranking.description})</p>
                </div>
              );
            })()}

            <div className="final-score">
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
        </div>
        </>
      )}
    </div>
  );
}

export default App;
