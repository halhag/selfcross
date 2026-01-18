# SelfCross

A word grid game where you strategically place letters to form valid words and maximize your score.

## How to Play

1. You start with a 5x5 empty grid
2. Three random letters are presented (following Scrabble letter frequency)
3. Drag and drop one letter into any empty square
4. Get three new random letters and repeat
5. Continue until all 25 squares are filled

## Scoring

Words are scored based on their length:
- **3-letter words**: 1 point each
- **4-letter words**: 2 points each
- **5-letter words**: 4 points each

The game checks for valid words in all horizontal and vertical rows. Words within words also count!

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for GitHub Pages deployment. Push to the `main` branch to trigger automatic deployment.

## Technologies

- React 18
- TypeScript
- Vite
- CSS3 (with modern gradients and animations)
