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
 * Extract contiguous letter sequences from a row/column
 * Returns array of strings, each representing a contiguous sequence of letters
 */
const extractContiguousSequences = (cells: (string | null)[]): string[] => {
  const sequences: string[] = [];
  let currentSequence = '';

  for (const cell of cells) {
    if (cell) {
      currentSequence += cell;
    } else {
      if (currentSequence.length > 0) {
        sequences.push(currentSequence);
        currentSequence = '';
      }
    }
  }

  // Don't forget the last sequence
  if (currentSequence.length > 0) {
    sequences.push(currentSequence);
  }

  return sequences;
};

/**
 * Extract all substrings of length 3, 4, and 5 from a string
 */
const extractSubstrings = (str: string): string[] => {
  const substrings: string[] = [];

  // Only extract if string is long enough
  for (let length = 3; length <= 5; length++) {
    if (str.length >= length) {
      for (let i = 0; i <= str.length - length; i++) {
        substrings.push(str.substring(i, i + length));
      }
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
    const sequences = extractContiguousSequences(grid[row]);
    sequences.forEach(sequence => {
      extractSubstrings(sequence).forEach(substr => {
        if (isValidWord(substr)) {
          foundWords.add(substr);
        }
      });
    });
  }

  // Check all 5 columns (vertical)
  for (let col = 0; col < 5; col++) {
    const column = grid.map(row => row[col]);
    const sequences = extractContiguousSequences(column);
    sequences.forEach(sequence => {
      extractSubstrings(sequence).forEach(substr => {
        if (isValidWord(substr)) {
          foundWords.add(substr);
        }
      });
    });
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
