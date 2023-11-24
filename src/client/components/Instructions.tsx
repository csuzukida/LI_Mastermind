import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, List, ListItem } from '@mui/material';
import { boxStyle } from '../utils';

const instructionBoxStyle = {
  ...boxStyle,
  overflowY: 'auto',
  '& ul': {
    padding: 0,
    listStyleType: 'disc',
    marginLeft: '1.5rem',
  },
  '& li': {
    display: 'list-item',
  },
};

const Instructions = () => {
  const navigate = useNavigate();
  const instructionSections = [
    {
      title: 'How to Play',
      content: [
        'The computer will generate a random 4-digit combination from 0-9',
        'You have 10 tries to guess the combination correctly',
        'After each guess, you will receive feedback on: the number of correct digits in total and the number of correct digits in the correct place, or if you got all the digits incorrect',
      ],
    },
    {
      title: 'Game Settings',
      content: [
        'Adjust the difficulty level to your preference!',
        'Change the number of digits in the combination',
        'Change the range that each digit can be (0-9)',
        'Set the maximum number of guesses allowed',
        'Toggle the timer and set your challenge',
      ],
    },
    {
      title: 'Create an Account',
      content: [
        'Sign up for a personalized experience and track your scores.',
        'Compete with friends and climb the leaderboard!',
        'Rest assured, your privacy is protected.',
      ],
    },
  ];

  return (
    <Box sx={instructionBoxStyle}>
      <Box sx={{ alignSelf: 'flex-start', marginLeft: '2rem', marginTop: '2rem' }}>
        <Button variant="contained" onClick={() => navigate('/')}>
          Home
        </Button>
      </Box>
      {instructionSections.map((section, index) => (
        <Box
          key={index}
          sx={{ width: '100%', marginLeft: '4rem', marginTop: '2rem', maxWidth: '500px' }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {section.title}
          </Typography>
          <List sx={{ padding: 0 }}>
            {section.content.map((point, idx) => (
              <ListItem
                key={idx}
                sx={{
                  display: 'list-item',
                  paddingLeft: '1rem',
                  typography: 'body1',
                  wordBreak: 'break-word',
                }}
              >
                {point}
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default Instructions;
