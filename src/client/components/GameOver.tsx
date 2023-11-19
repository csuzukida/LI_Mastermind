import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/joy';
import { GameContext } from '../contexts';

const Answer = () => {
  const { answer } = useContext(GameContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { win, message } = location.state;

  return (
    <>
      <Button onClick={() => navigate('/')}>Home</Button>
      <br />
      <Typography level="h3">The answer was {answer}</Typography>
      <br />
      {win ? (
        <Typography level="h3" color="primary">
          {message}
        </Typography>
      ) : (
        <Typography level="h3">{message}</Typography>
      )}
      <br />
      <Button onClick={() => navigate('/game')}>Play again?</Button>
    </>
  );
};

export default Answer;
