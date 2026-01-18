// Scrabble letter distribution
const SCRABBLE_DISTRIBUTION: { [key: string]: number } = {
  'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3, 'H': 2,
  'I': 9, 'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8, 'P': 2,
  'Q': 1, 'R': 6, 'S': 4, 'T': 6, 'U': 4, 'V': 2, 'W': 2, 'X': 1,
  'Y': 2, 'Z': 1
};

// Create a weighted pool of letters based on Scrabble distribution
const createLetterPool = (): string[] => {
  const pool: string[] = [];
  for (const [letter, count] of Object.entries(SCRABBLE_DISTRIBUTION)) {
    for (let i = 0; i < count; i++) {
      pool.push(letter);
    }
  }
  return pool;
};

const LETTER_POOL = createLetterPool();

/**
 * Generate N unique random letters following Scrabble frequency distribution
 */
export const generateRandomLetters = (count: number): string[] => {
  const available = [...LETTER_POOL];
  const result: string[] = [];
  const usedLetters = new Set<string>();

  while (result.length < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const letter = available[randomIndex];

    if (!usedLetters.has(letter)) {
      result.push(letter);
      usedLetters.add(letter);
    }

    // Remove this specific instance from the pool
    available.splice(randomIndex, 1);
  }

  return result;
};
