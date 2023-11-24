import { useContext, useEffect } from 'react';
import { Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { GameContext } from '../contexts';

const Timer = () => {
  // grab time and setTime from the GameContext which holds the user's settings
  const { time, setTime } = useContext(GameContext);

  useEffect(() => {
    // start an interval that decrements the time by 1 second (1000ms)
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        // if it reaches 0, clear the interval and return 0
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        // otherwise return the previous time minus 1 second
        return prevTime - 1000;
      });
    }, 1000);

    // cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [setTime]);

  // convert the time to minutes and seconds
  // 1000ms in 1 second, 60 seconds in 1 minute
  const minutes = Math.floor(time / 60 / 1000);
  // get num of seconds remainder (in ms) & divide by 1000ms to get seconds
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
