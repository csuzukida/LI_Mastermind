import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { boxStyle } from '../utils';

const instructionsBoxStyle = {
  boxSizing: 'border-box',
  padding: '1.5rem',
  ...boxStyle,
};

const Instructions = () => {
  const navigate = useNavigate();
  const logicSegments = [
    'The computer will generate a random 4 digit combination.',
    'You have 10 tries to guess the combination!',
    'After each guess, the code checker will tell you:',
    '- The number of correct digits in the correct place',
    '- The number of correct digits in the incorrect place',
    '- If you did not have any correct digits',
    'Use your logical thinking prowess to solve the combination!',
  ];

  const settingSegments = [
    'Find the game too easy or difficult?',
    'Easily adjust the game settings to your liking:',
    '- Increase or decrease the length of the combination',
    '- Increase or decrease the amount of guesses',
    '- Enable timer mode to also race against a clock',
    '- Adjust the timer for whatever difficulty level suits you',
  ];

  const accountSegments = [
    'Lastly, you can create an account with us!',
    "Don't worry, your information is secure",
    ' and we will never sell your information.',
    'Each win gives you 10 points',
    '+ 1 point for every guess you had remaining',
    '(only when set to 10 guesses or less).',
    'Add your friends and compete for',
    'bragging rights in a local leaderboard!',
  ];

  return (
    <Box sx={instructionsBoxStyle}>
      <Button onClick={() => navigate('/')}>Home</Button>
      <Typography level="body-lg" sx={{ textAlign: 'center', width: '100%', marginTop: '1rem' }}>
        Instructions
      </Typography>
      {logicSegments.map((segment, index) => (
        <Typography key={index} level="body-sm" sx={{ textAlign: 'center', width: '100%' }}>
          {segment}
        </Typography>
      ))}
      <br />
      {settingSegments.map((segment, index) => (
        <Typography key={index} level="body-sm" sx={{ textAlign: 'center', width: '100%' }}>
          {segment}
        </Typography>
      ))}
      <br />
      {accountSegments.map((segment, index) => (
        <Typography key={index} level="body-sm" sx={{ textAlign: 'center', width: '100%' }}>
          {segment}
        </Typography>
      ))}
    </Box>
  );
};

export default Instructions;
