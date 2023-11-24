import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { GameContext } from '../contexts';
import { boxStyle } from '../utils';

const Answer = () => {
  const { answer } = useContext(GameContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { win, message } = location.state;

  return (
    <Box sx={{ boxStyle }}>
      <br />
      <Typography level="h3">The answer was {answer}</Typography>
      <br />
      {win ? (
        <Typography level="h3" color="primary">
          {message}
        </Typography>
      ) : (
        <Typography level="h3" color="primary">
          {message}
        </Typography>
      )}
      <br />
      <Box>
        <Button sx={{ marginRight: '1rem' }} onClick={() => navigate('/game')}>
          Play again?
        </Button>
        <Button onClick={() => navigate('/')}>Home</Button>
      </Box>
    </Box>
  );
};

export default Answer;
