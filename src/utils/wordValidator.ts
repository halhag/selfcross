import { THREE_LETTER_WORDS, FOUR_LETTER_WORDS, FIVE_LETTER_WORDS } from '../data/words';

// Create sets for O(1) lookup
const threeLetterSet = new Set(THREE_LETTER_WORDS);
const fourLetterSet = new Set(FOUR_LETTER_WORDS);
const fiveLetterSet = new Set(FIVE_LETTER_WORDS);

export const isValidWord = (word: string): boolean => {
  const upperWord = word.toUpperCase();
  const length = upperWord.length;

  if (length === 3) return threeLetterSet.has(upperWord);
  if (length === 4) return fourLetterSet.has(upperWord);
  if (length === 5) return fiveLetterSet.has(upperWord);

  return false;
};

export interface ScoredWord {
  word: string;
  points: number;
}

export interface GameScore {
  total: number;
  onePointWords: string[];
  twoPointWords: string[];
  fourPointWords: string[];
}

/**
 * Extract all substrings of length 3, 4, and 5 from a string
 */
const extractSubstrings = (str: string): string[] => {
  const substrings: string[] = [];

  for (let length = 3; length <= 5; length++) {
    for (let i = 0; i <= str.length - length; i++) {
      substrings.push(str.substring(i, i + length));
    }
  }

  return substrings;
};

/**
 * Calculate score for the current grid
 * @param grid 5x5 array of letters (empty cells are null or empty string)
 */
export const calculateScore = (grid: (string | null)[][]): GameScore => {
  const foundWords = new Set<string>();

  // Check all 5 rows (horizontal)
  for (let row = 0; row < 5; row++) {
    const rowStr = grid[row].map(cell => cell || '').join('');
    if (rowStr.length > 0) {
      extractSubstrings(rowStr).forEach(substr => {
        if (isValidWord(substr)) {
          foundWords.add(substr);
        }
      });
    }
  }

  // Check all 5 columns (vertical)
  for (let col = 0; col < 5; col++) {
    const colStr = grid.map(row => row[col] || '').join('');
    if (colStr.length > 0) {
      extractSubstrings(colStr).forEach(substr => {
        if (isValidWord(substr)) {
          foundWords.add(substr);
        }
      });
    }
  }

  // Categorize words by points
  const onePointWords: string[] = [];
  const twoPointWords: string[] = [];
  const fourPointWords: string[] = [];
  let total = 0;

  foundWords.forEach(word => {
    if (word.length === 3) {
      onePointWords.push(word);
      total += 1;
    } else if (word.length === 4) {
      twoPointWords.push(word);
      total += 2;
    } else if (word.length === 5) {
      fourPointWords.push(word);
      total += 4;
    }
  });

  // Sort alphabetically
  onePointWords.sort();
  twoPointWords.sort();
  fourPointWords.sort();

  return {
    total,
    onePointWords,
    twoPointWords,
    fourPointWords
  };
};
