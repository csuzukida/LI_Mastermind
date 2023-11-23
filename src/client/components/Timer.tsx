import { useContext, useEffect } from 'react';
import { Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { GameContext } from '../contexts';

const Timer = () => {
  const { time, setTime } = useContext(GameContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setTime]);

  const minutes = Math.floor(time / 60 / 1000);
  const seconds = ((time % 60000) / 1000).toFixed(0);

  return (
    <Box>
      <Typography>
        Time remaining: {minutes} minutes: {seconds} seconds
      </Typography>
    </Box>
  );
};

export default Timer;
