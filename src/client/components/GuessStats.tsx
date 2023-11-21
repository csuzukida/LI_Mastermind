import { useContext } from 'react';
import { Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { GameContext } from '../contexts';

interface GuessStatProps {
  guessCount: number;
  correctCount: number;
  correctLocationCount: number;
  noneCorrect: boolean;
}

const GuessStats = ({
  guessCount,
  correctCount,
  correctLocationCount,
  noneCorrect,
}: GuessStatProps) => {
  const { maxGuesses } = useContext(GameContext);
  return (
    <Box
      bgcolor="white"
      py={5}
      px={{ xs: 2.5, md: 5.5 }}
      borderRadius="16px"
      boxShadow={3}
      sx={{ flex: 1, maxHeight: '8rem' }}
    >
      <Typography level="body-lg">Guess Stats</Typography>
      <Typography level="body-sm">Guesses Left: {maxGuesses - guessCount}</Typography>
      <Typography level="body-sm">
        {correctCount} correct number{correctCount > 1 ? 's' : ''}
      </Typography>
      <Typography level="body-sm">{correctLocationCount} correct location</Typography>
      {noneCorrect && (
        <Typography level="body-sm" color="danger">
          All incorrect!
        </Typography>
      )}
    </Box>
  );
};

export default GuessStats;
