import { Typography } from '@mui/joy';
import { Box } from '@mui/material';

interface GuessHistoryProps {
  guessHistory: [string, number, number][] | [];
}

const GuessHistory = ({ guessHistory }: GuessHistoryProps) => {
  return (
    <Box
      bgcolor="white"
      py={5}
      px={{ xs: 2.5, md: 5.5 }}
      borderRadius="16px"
      boxShadow={3}
      sx={{ flex: 1, maxHeight: '8rem', overflowY: 'scroll' }}
    >
      <Typography level="body-lg">Guess History</Typography>
      {guessHistory
        .map((el, i) => {
          const [guess, correct, correctLocation] = el;
          return (
            <div key={i}>
              <Typography level="body-sm" color="primary">
                Guess {i + 1}: {guess}
              </Typography>
              <Typography level="body-sm" sx={{ marginLeft: 2 }}>
                {correct} correct number{correct > 1 ? 's' : ''}, {correctLocation} correct location
              </Typography>
            </div>
          );
        })
        .reverse()}
    </Box>
  );
};

export default GuessHistory;
