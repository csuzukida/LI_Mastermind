import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Slider, Switch, Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { Logo } from '../components';
import { GameContext } from '../contexts';

const BoxStyle = {
  borderRadius: '16px',
  maxWidth: '600px',
  width: '600px',
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: 3,
  boxSizing: 'border-box',
  padding: '1.5rem',
};

const Settings = () => {
  const { numDigits, setNumDigits, timer, setTimer, maxGuesses, setMaxGuesses } =
    useContext(GameContext);

  const MINUTE_IN_MILLISECONDS = 60000;
  // hold local state for default reset
  const [localMaxGuesses, setLocalMaxGuesses] = useState<number>(maxGuesses);
  const [localNumDigits, setLocalNumDigits] = useState<number>(numDigits);
  const [localTimer, setLocalTimer] = useState<number>(timer / MINUTE_IN_MILLISECONDS);
  const [showTimer, setShowTimer] = useState(false);

  const navigate = useNavigate();

  const digitSliderMarks = [
    {
      value: 3,
      label: '3',
    },
    {
      value: 10,
      label: '10',
    },
  ];

  const guessSliderMarks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 20,
      label: '20',
    },
  ];

  const timerSliderMarks = [
    {
      value: 1,
      label: '1 min',
    },
    {
      value: 5,
      label: '5 min',
    },
    {
      value: 10,
      label: '10 min',
    },
  ];

  const handleRevertClick = () => {
    setLocalMaxGuesses(10);
    setLocalNumDigits(4);
    setLocalTimer(5);
    setShowTimer(false);
  };

  const handleSaveClick = () => {
    setMaxGuesses(localMaxGuesses);
    setNumDigits(localNumDigits);
    setTimer(localTimer * MINUTE_IN_MILLISECONDS);
    navigate(-1);
  };

  return (
    <Box sx={BoxStyle}>
      <Box sx={{ marginTop: '-3rem' }}>
        <Logo />
      </Box>
      <br />
      <Typography>Number of digits in combination: </Typography>
      <Box>
        <Slider
          value={localNumDigits}
          min={3}
          max={10}
          marks={digitSliderMarks}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            setLocalNumDigits(value as number);
          }}
        />
        <Typography>Maximum number of guesses: </Typography>
        <Slider
          value={localMaxGuesses}
          min={1}
          max={20}
          marks={guessSliderMarks}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            setLocalMaxGuesses(value as number);
          }}
        />
        <Typography>Enable Timer?</Typography>
        <Switch checked={showTimer} onChange={() => setShowTimer(!showTimer)} />
        {showTimer && (
          <>
            <Typography>Timer Length: </Typography>
            <Slider
              value={localTimer}
              min={1}
              max={10}
              marks={timerSliderMarks}
              valueLabelDisplay="auto"
              onChange={(e, value) => {
                setLocalTimer(value as number);
              }}
            />
            <br />
            <br />
          </>
        )}
        <br />
        <br />
        <Box>
          <Button sx={{ marginRight: '1rem' }} onClick={handleRevertClick}>
            Revert to default
          </Button>
          <Button onClick={handleSaveClick}>Save Settings</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
